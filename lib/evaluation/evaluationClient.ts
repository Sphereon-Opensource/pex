import { PresentationDefinition } from '@sphereon/pe-models';

import { Checked, Status } from '../ConstraintUtils';

import { EvaluationHandler } from './evaluationHandler';
import { FilterShouldExistIfPredicateExistsEvaluationHandler } from './filterShouldExistIfPredicateExistsEvaluationHandler';
import { HandlerCheckResult } from './handlerCheckResult';
import { PredicateRelatedFieldEvaluationHandler } from './predicateRelatedFieldEvaluationHandlerEvaluationHandler';
import { UriEvaluationHandler } from './uriEvaluationHandler';
import { InputDescriptorFilterEvaluationHandler } from './inputDescriptorFilterEvaluationHandler';

export class EvaluationClient {
  private failed_catched: Checked = {
    tag: 'root',
    status: Status.ERROR,
    message: 'unknown exception occurred: ',
  };

  public evaluate(pd: PresentationDefinition, vp: unknown): HandlerCheckResult[] {
    const results: HandlerCheckResult[] = [];
    let rootHandler: EvaluationHandler = this.initEvaluationHandlers();
    rootHandler.handle(pd, vp, results);
    while (rootHandler.hasNext()) {
      rootHandler = rootHandler.getNext();
      try {
        rootHandler.handle(pd, vp, results);
      } catch (e) {
        this.failed_catched.message += e.message;
        throw this.failed_catched;
      }
    }
    return results;
  }

  private initEvaluationHandlers() {
    const uriEvaluation = new UriEvaluationHandler();
    const filterShouldExistIfPredicateEvaluationHandler = new FilterShouldExistIfPredicateExistsEvaluationHandler();
    const predicateEvaluationHandler = new PredicateRelatedFieldEvaluationHandler();
    const filterEvaluationHandler = new InputDescriptorFilterEvaluationHandler();

    uriEvaluation
    .setNext(filterShouldExistIfPredicateEvaluationHandler)
    .setNext(predicateEvaluationHandler)
    .setNext(filterEvaluationHandler);

    return uriEvaluation;
  }
}
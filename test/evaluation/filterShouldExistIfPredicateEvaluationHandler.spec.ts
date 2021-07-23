import fs from 'fs';

import { PresentationDefinition } from '@sphereon/pe-models';

import { Status } from "../../lib";
import { EvaluationHandler } from "../../lib/evaluation/evaluationHandler";
import { FilterShouldExistIfPredicateExistsEvaluationHandler } from "../../lib/evaluation/filterShouldExistIfPredicateExistsEvaluationHandler";
import { HandlerCheckResult } from "../../lib/evaluation/handlerCheckResult";

function getFile(path: string) {
  return JSON.parse(fs.readFileSync(path, 'utf-8'));
}

describe('evaluate', () => {

  it('should report error if the predicate is present and filter is not', function () {
    const pdSchema: PresentationDefinition = getFile('./test/dif_pe_examples/pd/pd-simple-schema-age-predicate.json').presentation_definition;
    delete pdSchema.input_descriptors[0].constraints.fields[0].filter;
    const vpSimple = getFile('./test/dif_pe_examples/vp/vp-simple-age-predicate.json');
    const evaluationHandler: EvaluationHandler = new FilterShouldExistIfPredicateExistsEvaluationHandler();
    const results: HandlerCheckResult[] = [];
    evaluationHandler.handle(pdSchema, vpSimple, results);
    expect(results[0]).toEqual(new HandlerCheckResult('root.input_descriptors[0].constraints.fields[0]', '', 'FilterShouldExistIfPredicateExists', Status.ERROR, "if in the field we have predicate value, the filter value should be present as well."));
  });

  it('should report info if the predicate and filter are both present', function () {
    const pdSchema: PresentationDefinition = getFile('./test/dif_pe_examples/pd/pd-simple-schema-age-predicate.json').presentation_definition;
    const vpSimple = getFile('./test/dif_pe_examples/vp/vp-simple-age-predicate.json');
    const evaluationHandler: EvaluationHandler = new FilterShouldExistIfPredicateExistsEvaluationHandler();
    const results: HandlerCheckResult[] = [];
    evaluationHandler.handle(pdSchema, vpSimple, results);
    expect(results[0]).toEqual(new HandlerCheckResult('root.input_descriptors[0].constraints.fields[0]', '', 'FilterShouldExistIfPredicateExists', Status.INFO, "predicate value and the filter value are both present."));
  });
});
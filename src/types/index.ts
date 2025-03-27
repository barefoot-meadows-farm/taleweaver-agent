
export interface UserStoryRequest {
  requirement: string;
  context?: string;
  stakeholders?: string[];
  api_required?: boolean;
  additional_details?: string;
}

export interface UserStoryResponse {
  story: string;
  value_statement: string;
  acceptance_criteria: string[];
  functional_requirements: string[];
  non_functional_requirements: string[];
  error_scenarios: ErrorScenario[];
  technical_considerations: string[];
  use_case_examples: string[];
  priority: string;
  effort_estimate: string;
  test_cases: TestCase[];
  api_specs: ApiSpec[];
}

interface ErrorScenario {
  scenario: string;
  message: string;
}

interface TestCase {
  title: string;
  scenario: string;
  given: string[];
  when: string[];
  then: string[];
  rest_assured_code: string;
}

interface ApiSpec {
  endpoint: string;
  method: string;
  description: string;
  request_example: any;
  response_example: any;
  error_responses: {
    status_code: string;
    error: string;
    message: string;
  }[];
}

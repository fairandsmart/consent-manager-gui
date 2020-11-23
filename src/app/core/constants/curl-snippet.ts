import { ConsentContext } from '../models/models';
import { environment } from '../../../environments/environment';

export const CURL_SNIPPET =
`curl '$$API_URL$$/consents/token' \\
  -H 'Accept: application/json, text/plain, */*' \\
  -H 'Authorization: Basic PUT_YOUR_BASE_64_ENCODED_API_KEY' \\
  -H 'Content-Type: application/json' \\
  --data-binary '$$JSON$$' \\
  --compressed
`;

export function getCurlSnippetFromContext(context: ConsentContext): string {
  return CURL_SNIPPET
    .replace('$$API_URL$$', environment.managerUrl)
    .replace('$$JSON$$', JSON.stringify(context));
}

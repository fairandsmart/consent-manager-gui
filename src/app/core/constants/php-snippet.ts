import { ConsentContext } from '../models/models';
import { environment } from '../../../environments/environment';

export const PHP_SNIPPET =
`<?php
function getFormUrl() {
    $api_url = "$$API_URL$$";
    $api_key = "PUT_YOUR_API_KEY_HERE";
    $context = [
        "subject" => "$$SUBJECT$$",
        "orientation" => "$$ORIENTATION$$",
        "info" => "$$INFO$$",
        "elements" => array($$ELEMENTS$$),
        "callback" => "$$CALLBACK$$",
        "language" => "$$LANGUAGE$$",
        "validity" => "$$VALIDITY$$",
        "formType" => "$$FORM_TYPE$$",
        "receiptDeliveryType" => "$$RECEIPT_DELIVERY_TYPE$$",
        "theme" => "$$THEME$$",
        "iframe" => $$IFRAME$$
    ];

    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => $api_url . "/consents/token",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => json_encode($context),
        CURLOPT_HTTPHEADER => array(
            "Authorization: Basic ".base64_encode($api_key),
            "Content-Type: application/json",
        ),
    ));

    $consent_token = curl_exec($curl);
    $err = curl_error($curl);

    curl_close($curl);

    if ($err) {
        echo "cURL Error #:" . $err;
    }

    return $api_url."/consents?t=".$consent_token;

}

$formUrl = getFormUrl();

?>

<html>
<body>
  <iframe width="700" height="500" src="<?php echo $formUrl ?>"></iframe>
</body>
</html>
`;

export function getPhpSnippetFromContext(context: ConsentContext): string {
  return PHP_SNIPPET
    .replace('$$API_URL$$', environment.managerUrl)
    .replace('$$SUBJECT$$', context.subject)
    .replace('$$ORIENTATION$$', context.orientation)
    .replace('$$INFO$$', context.info)
    .replace('$$ELEMENTS$$', `"${context.elements.join('","')}"`)
    .replace('$$CALLBACK$$', context.callback)
    .replace('$$LANGUAGE$$', context.language)
    .replace('$$VALIDITY$$', context.validity)
    .replace('$$FORM_TYPE$$', context.formType)
    .replace('$$RECEIPT_DELIVERY_TYPE$$', context.receiptDeliveryType)
    .replace('$$THEME$$', context.theme)
    .replace('$$IFRAME$$', String(context.iframe))
    ;
}

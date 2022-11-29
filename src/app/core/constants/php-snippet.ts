/*-
 * #%L
 * Right Consents, a Universal Consents & Preferences Management Platform.
 * %%
 * Copyright (C) 2020 - 2021 Fair And Smart
 * %%
 * This file is part of Right Consents Community Edition.
 *
 * Right Consents Community Edition is published by FAIR AND SMART under the
 * GNU GENERAL PUBLIC LICENCE Version 3 (GPLv3) and a set of additional terms.
 *
 * For more information, please see the “LICENSE” and “LICENSE.FAIRANDSMART”
 * files, or see https://www.fairandsmart.com/opensource/.
 * #L%
 */

import { environment } from '../../../environments/environment';
import { ConsentContext } from '@fairandsmart/consents-ce/consents';

export const PHP_SNIPPET = `<?php
function getFormUrl()
{
    $api_url = "$$API_URL$$";
    $access_token = "PUT_YOUR_ADMIN_ACCESS_TOKEN_HERE";

    $consent_context = array(
        "subject" => "$$SUBJECT$$",
        "object" => "$$OBJECT$$",
        "callback" => "$$CALLBACK$$",
        "iframeOrigin" => "$$IFRAME_ORIGIN$$",
        "language" => "$$LANGUAGE$$",
        "origin" => "$$ORIGIN$$",
        "validity" => "$$VALIDITY$$",
        "updatable" => $$UPDATABLE$$,
        "subjectInfos" => $$SUBJECT_INFOS$$,
        "attributes" => $$ATTRIBUTES$$,
        "author" => "$$AUTHOR$$",
        "confirmation" => "$$CONFIRMATION$$",
        "confirmationConfig" => $$CONFIRMATION_CONFIG$$,
        "theme" => "$$THEME$$",
        "layoutData" => array(
            "type" => "layout",
            "info" => "$$INFO$$",
            "elements" => array($$ELEMENTS$$),
            "defaultNotification" => "$$NOTIFICATION$$",
            "orientation" => "$$ORIENTATION$$",
            "existingElementsVisible" => $$EXISTING_VISIBLE$$,
            "validityVisible" => $$VALIDITY_VISIBLE$$,
            "includeIFrameResizer" => $$IFRAME_RESIZER$$,
            "acceptAllVisible" => $$ACCEPT_ALL_VISIBLE$$,
            "acceptAllText" => "$$ACCEPT_ALL_TEXT$$",
            "submitText" => "$$SUBMIT_TEXT$$",
            "cancelVisible" => $$CANCEL_VISIBLE$$,
            "cancelText" => "$$CANCEL_TEXT$$",
            "footerOnTop" => $$FOOTER_ON_TOP$$,
        ),
    );

    $options = array(
        'http' => array (
            'method' => "POST",
            'header' => array(
                "Authorization: Bearer " . $access_token,
                "Accept: application/json, text/plain, */*",
                "Content-Type: application/json",
            ),
            'content' => json_encode($consent_context)
        )
    );

    $request_context = stream_context_create($options);
    $consent_token = file_get_contents($api_url . "/consents", false, $request_context);

    if ($err) {
        echo "cURL Error #:" . $err;
    }

    $options = array(
        'http' => array (
            'method' => "GET",
            'header' => array(
                "Authorization: Bearer " . $access_token,
                "Accept: application/json, text/plain, */*",
            ),
        )
    );
    $request_context = stream_context_create($options);
    $encoded_transaction = file_get_contents($api_url . "/consents/" . $consent_token, false, $request_context);

    if ($err) {
        echo "cURL Error #:" . $err;
    }

    $transaction = json_decode(trim($encoded_transaction), true);
    return $transaction["task"] . "?t=" . $transaction["token"];
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>Right Consents iFrame Integration Test</title>
</head>
<body>
    <h2 style="text-align: center">Right Consents iFrame Integration Test</h2>
    <div style="text-align: center;">
        <iframe src="<?php echo getFormUrl() ?>" id="content" frameborder="0" style="width:100%; height:100vh;"></iframe>
    </div>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.2.11/iframeResizer.js" onload="iFrameResize({log: true}, '#content');"></script>
</body>
</html>`;

function objectToPhp(object: { [key: string]: string }): string {
  if (object && Object.keys(object).length > 0) {
    let result = '';
    Object.keys(object).forEach((key) => {
      result += `\t\t\t"${key}" => "${object[key]}",\n`;
    });
    return `array(\n${result}\t\t)`;
  }
  return 'new stdClass()';
}

export function getPhpSnippetFromContext(context: ConsentContext): string {
  return PHP_SNIPPET
    .replace('$$API_URL$$', environment.managerUrl)
    .replace('$$SUBJECT$$', context.subject)
    .replace('$$OBJECT$$', context.object)
    .replace('$$CALLBACK$$', context.callback)
    .replace('$$IFRAME_ORIGIN$$', context.iframeOrigin)
    .replace('$$LANGUAGE$$', context.language)
    .replace('$$ORIGIN$$', context.origin)
    .replace('$$VALIDITY$$', context.validity)
    .replace('$$UPDATABLE$$', String(context.updatable))
    .replace('$$SUBJECT_INFOS$$', objectToPhp(context.subjectInfos))
    .replace('$$ATTRIBUTES$$', objectToPhp(context.attributes))
    .replace('$$AUTHOR$$', context.author)
    .replace('$$CONFIRMATION$$', context.confirmation)
    .replace('$$CONFIRMATION_CONFIG$$', objectToPhp(context.confirmationConfig))
    .replace('$$THEME$$', context.theme)
    .replace('$$NOTIFICATION$$', context.layoutData.defaultNotification)
    .replace('$$INFO$$', context.layoutData.info)
    .replace('$$ELEMENTS$$', `"${context.layoutData.elements.join('","')}"`)
    .replace('$$ORIENTATION$$', context.layoutData.orientation)
    .replace('$$EXISTING_VISIBLE$$', String(context.layoutData.existingElementsVisible))
    .replace('$$VALIDITY_VISIBLE$$', String(context.layoutData.validityVisible))
    .replace('$$IFRAME_RESIZER$$', String(context.layoutData.includeIFrameResizer))
    .replace('$$ACCEPT_ALL_VISIBLE$$', String(context.layoutData.acceptAllVisible))
    .replace('$$ACCEPT_ALL_TEXT$$', context.layoutData.acceptAllText)
    .replace('$$SUBMIT_TEXT$$', context.layoutData.submitText)
    .replace('$$CANCEL_VISIBLE$$', String(context.layoutData.cancelVisible))
    .replace('$$CANCEL_TEXT$$', context.layoutData.cancelText)
    .replace('$$FOOTER_ON_TOP$$', String(context.layoutData.footerOnTop));
}

#!/usr/bin/env sh

set -e

[ -z "$FS_DEBUG" ] || set -x

install_theme() {
    [ "$#" -ne 1 ] && error "install_theme : wrong number of args"
    theme_folder="/themes/$1"
    [ -r "$theme_folder"  ] || error "can't read theme $theme_folder"

    while IFS= read -r line
    do
        from=$(echo "$line" | sed "s/|[^|]\+//")
        to=$(echo "$line" | sed "s/[^|]\+|//")
        find "$WHEREMYFILESARE" -type f -exec sed -i "s|$from|$to|g" {} \;
    done < "$theme_folder"
}

# consts
WHEREMYFILESARE=/usr/share/nginx/html

# vars
FS_AUTH_ORIGINAL_CLIENTID=${FS_AUTH_ORIGINAL_CLIENTID:-PUT_AUTH_CLIENTID_HERE}
FS_AUTH_CLIENTID=${FS_AUTH_CLIENTID:-fsconsentmgr}
FS_AUTH_ORIGINAL_REALM=${FS_AUTH_ORIGINAL_REALM:-PUT_AUTH_REALM_HERE}
FS_AUTH_REALM=${FS_AUTH_REALM:-FairAndSmart}
FS_AUTH_ORIGINAL_URI=${FS_AUTH_ORIGINAL_URI:-PUT_AUTH_HOST_HERE}
FS_AUTH_URI=${FS_AUTH_URI:-http://127.0.0.1:8080}
FS_MANAGER_ORIGINAL_URI=${FS_MANAGER_ORIGINAL_URI:-PUT_MANAGER_URI_HERE}
FS_MANAGER_URI=${FS_MANAGER_URI:-http://127.0.0.1:8087}
FS_THEME=${FS_THEME:-community-dev}

echo Installing "$FS_THEME" theme
install_theme "$FS_THEME"

# set AUTH clientid
echo Setting AUTH clientid FS_AUTH_CLIENTID
[ -n "$FS_AUTH_CLIENTID" ]
find "$WHEREMYFILESARE" -type f -exec sed -i "s|$FS_AUTH_ORIGINAL_CLIENTID|$FS_AUTH_CLIENTID|g" {} \;
grep -qr "$FS_AUTH_CLIENTID" "$WHEREMYFILESARE"

# set AUTH realm
echo Setting AUTH realm FS_AUTH_REALM
[ -n "$FS_AUTH_REALM" ]
find "$WHEREMYFILESARE" -type f -exec sed -i "s|$FS_AUTH_ORIGINAL_REALM|$FS_AUTH_REALM|g" {} \;
grep -qr "$FS_AUTH_REALM" "$WHEREMYFILESARE"

# set AUTH endpoint
echo Setting AUTH endpoint FS_AUTH_URI
[ -n "$FS_AUTH_URI" ]
find "$WHEREMYFILESARE" -type f -exec sed -i "s|$FS_AUTH_ORIGINAL_URI|$FS_AUTH_URI|g" {} \;
grep -qr "$FS_AUTH_URI" "$WHEREMYFILESARE"

# set MANAGER endpoint
echo Setting MANAGER endpoint FS_MANAGER_URI
[ -n "$FS_MANAGER_URI" ]
find "$WHEREMYFILESARE" -type f -exec sed -i "s|$FS_MANAGER_ORIGINAL_URI|$FS_MANAGER_URI|g" {} \;
grep -qr "$FS_MANAGER_URI" "$WHEREMYFILESARE"

# go
exec nginx -g "daemon off;"

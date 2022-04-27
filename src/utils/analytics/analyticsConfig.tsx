import { createClient } from '@segment/analytics-react-native';
export function congifureClient(){
    return createClient({
        writeKey: "ihpkbXAuEyB5OSJaXfj5DtD5GYmWZeWp",
        trackAppLifecycleEvents: true,
        //additional config options
       });
}
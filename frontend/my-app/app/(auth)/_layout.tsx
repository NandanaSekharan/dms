import { Stack } from "expo-router";

export default function Layout() {
    return(
        <Stack>
            <Stack.Screen name="Login" options={{headerShown:false}}/>
            <Stack.Screen name="SignUpPage" options={{headerShown:false}}/>
            <Stack.Screen name="userRegister" options={{headerShown:false}}/>
            <Stack.Screen name="voluntererRegister" options={{headerShown:false}}/>
            <Stack.Screen name="voluntererLogin" options={{headerShown:false}}/>
        </Stack>
    )
}

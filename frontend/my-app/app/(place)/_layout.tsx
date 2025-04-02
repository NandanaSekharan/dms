import { Stack } from 'expo-router';
export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="teacher" options={{headerShown:false}}/>
      <Stack.Screen name="courses"/>
      <Stack.Screen name="assignments"/>
      <Stack.Screen name="menu"/>
      <Stack.Screen name="attendance"/>
      <Stack.Screen name="accept"/>
     
    </Stack>
  );
}

import { View, Text } from "react-native"
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import StylingConstants from "./StylingConstants";

export default function PrivacyPolicyScreen() {
    return (
        <SafeAreaView>
            <ScrollView style={{ margin: 5 }}>
                <Text style={{ marginBottom: 20, color: "black", fontFamily: StylingConstants.defaultFontBold, fontSize: StylingConstants.normalFontSize, textAlign: "justify" }}>
                    We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and disclose your personal data when you use Optimood.
                </Text>
                <Text style={{ marginBottom: 3, color: "black", fontFamily: StylingConstants.defaultFontBold, fontSize: StylingConstants.subFontSize, textAlign: "justify" }}>
                    Information We Collect
                </Text>
                <Text style={{ marginBottom: 30, color: "black", fontFamily: StylingConstants.defaultFont, fontSize: StylingConstants.tinyFontSize, textAlign: "justify" }}>
                    We collect the following types of personal data when you use the App:
                    {"\n"}
                    {"\n"}
                    1. Email: We collect your email address when you sign up for the App in order to create an account and provide you with access to the App.{"\n"}{"\n"}
                    2. Daily Mood Ratings: We collect your daily mood ratings in order to help you track your mental health and provide insights into your daily mood patterns.{"\n"}{"\n"}
                    3. Task Ratings: We collect your task ratings in order to help you understand how your tasks affect your mood and provide you with insights into how to plan your day better.

                </Text>
                <Text style={{ marginBottom: 3, color: "black", fontFamily: StylingConstants.defaultFontBold, fontSize: StylingConstants.subFontSize, textAlign: "justify" }}>
                    Use of Information
                </Text>
                <Text style={{ marginBottom: 30, color: "black", fontFamily: StylingConstants.defaultFont, fontSize: StylingConstants.tinyFontSize, textAlign: "justify" }}>
                    We use the personal data we collect to provide you with access to the App and to provide you with insights into your mental health and mood patterns. We may also use your personal data for the following purposes:
                    {"\n"}{"\n"}
                    1. To personalize your experience using the App;{"\n"}{"\n"}
                    2. To communicate with you about the App, including updates and changes to the App;{"\n"}{"\n"}
                    3. To improve the App and develop new features;{"\n"}{"\n"}
                    4. To enforce our Terms of Service and other policies;{"\n"}{"\n"}
                    5. To comply with legal requirements.
                </Text>
                <Text style={{ marginBottom: 3, color: "black", fontFamily: StylingConstants.defaultFontBold, fontSize: StylingConstants.subFontSize, textAlign: "justify" }}>
                    Sharing of Information
                </Text>
                <Text style={{ marginBottom: 30, color: "black", fontFamily: StylingConstants.defaultFont, fontSize: StylingConstants.tinyFontSize, textAlign: "justify" }}>
                    We do not share your personal data with third parties except as follows:
                    {"\n"}{"\n"}
                    1. Service Providers: We may share your personal data with service providers who help us operate the App and provide you with access to the App. {"\n"}{"\n"}
                    2. Legal Requirements: We may disclose your personal data if required to do so by law or in response to a subpoena or court order.

                </Text>
                <Text style={{ marginBottom: 3, color: "black", fontFamily: StylingConstants.defaultFontBold, fontSize: StylingConstants.subFontSize, textAlign: "justify" }}>
                    Data Retention
                </Text>
                <Text style={{ marginBottom: 30, color: "black", fontFamily: StylingConstants.defaultFont, fontSize: StylingConstants.tinyFontSize, textAlign: "justify" }}>
                    We will retain your personal data for as long as necessary to provide you with access to the App and to comply with our legal obligations.


                </Text>
                <Text style={{ marginBottom: 3, color: "black", fontFamily: StylingConstants.defaultFontBold, fontSize: StylingConstants.subFontSize, textAlign: "justify" }}>
                    Your Rights
                </Text>
                <Text style={{ marginBottom: 30, color: "black", fontFamily: StylingConstants.defaultFont, fontSize: StylingConstants.tinyFontSize, textAlign: "justify" }}>
                    You have the right to access, modify, or delete your personal data at any time by contacting us using the contact information provided in the App. You also have the right to withdraw your consent to the collection and use of your personal data at any time.



                </Text>
                <Text style={{ marginBottom: 3, color: "black", fontFamily: StylingConstants.defaultFontBold, fontSize: StylingConstants.subFontSize, textAlign: "justify" }}>
                    Security
                </Text>
                <Text style={{ marginBottom: 30, color: "black", fontFamily: StylingConstants.defaultFont, fontSize: StylingConstants.tinyFontSize, textAlign: "justify" }}>
                    We take reasonable measures to protect your personal data from unauthorized access, disclosure, alteration, or destruction. However, we cannot guarantee that our security measures will prevent unauthorized access to your personal data.



                </Text>
                <Text style={{ marginBottom: 3, color: "black", fontFamily: StylingConstants.defaultFontBold, fontSize: StylingConstants.subFontSize, textAlign: "justify" }}>
                    Changes to Privacy Policy
                </Text>
                <Text style={{ marginBottom: 30, color: "black", fontFamily: StylingConstants.defaultFont, fontSize: StylingConstants.tinyFontSize, textAlign: "justify" }}>
                    We reserve the right to modify this Privacy Policy at any time. Any changes will be effective immediately upon posting the updated Privacy Policy on the App.




                </Text>

                <Text style={{ marginBottom: 3, color: "black", fontFamily: StylingConstants.defaultFontBold, fontSize: StylingConstants.subFontSize, textAlign: "justify" }}>
                    Contact Us
                </Text>
                <Text style={{ marginBottom: 30, color: "black", fontFamily: StylingConstants.defaultFont, fontSize: StylingConstants.tinyFontSize, textAlign: "justify" }}>
                    If you have any questions or concerns about this Privacy Policy or our collection, use, or disclosure of your personal data, please contact us at optimoodtracking@gmail.com.



                </Text>

              
            </ScrollView>
        </SafeAreaView>
    )
}
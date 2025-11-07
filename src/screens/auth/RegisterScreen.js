import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-toast-message';
import DatePicker from 'react-native-date-picker';

import { register, selectIsLoading, selectError } from '../../store/auth/authSlice';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Colors } from '../../styles/colors';
import { Fonts, Typography } from '../../styles/fonts';
import { Spacing } from '../../styles/spacing';

// Validation schema
const schema = yup.object({
  first_name: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  last_name: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email'),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^(\+234|0)[789]\d{9}$/, 'Please enter a valid Nigerian phone number'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain uppercase, lowercase, number and special character'
    ),
  password_confirmation: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
  date_of_birth: yup
    .date()
    .required('Date of birth is required')
    .max(new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000), 'You must be at least 18 years old'),
  gender: yup
    .string()
    .required('Gender is required')
    .oneOf(['male', 'female'], 'Please select a valid gender'),
  address: yup
    .string()
    .required('Address is required')
    .min(10, 'Please enter a complete address'),
  city: yup
    .string()
    .required('City is required'),
  state: yup
    .string()
    .required('State is required'),
  terms: yup
    .boolean()
    .oneOf([true], 'You must accept the terms and conditions'),
}).required();

const RegisterScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const scrollViewRef = useRef(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      password: '',
      password_confirmation: '',
      date_of_birth: null,
      gender: '',
      address: '',
      city: '',
      state: '',
      terms: false,
    },
  });

  const watchGender = watch('gender');
  const watchTerms = watch('terms');

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        date_of_birth: data.date_of_birth.toISOString().split('T')[0],
      };

      const result = await dispatch(register(formattedData)).unwrap();
      
      if (result) {
        Toast.show({
          type: 'success',
          text1: 'Registration Successful!',
          text2: 'Your account has been created successfully',
        });
        
        Alert.alert(
          'Account Created',
          `Your account number is: ${result.account.account_number}`,
          [
            {
              text: 'Continue',
              onPress: () => navigation.replace('Main'),
            },
          ]
        );
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: error.message || 'Please check your details and try again',
      });
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicatorContainer}>
      <View style={styles.stepIndicator}>
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <View style={styles.stepItem}>
              <View
                style={[
                  styles.stepCircle,
                  currentStep >= step && styles.stepCircleActive,
                ]}>
                {currentStep > step ? (
                  <Icon name="check" size={16} color={Colors.white} />
                ) : (
                  <Text
                    style={[
                      styles.stepNumber,
                      currentStep >= step && styles.stepNumberActive,
                    ]}>
                    {step}
                  </Text>
                )}
              </View>
            </View>
            {step < 3 && (
              <View
                style={[
                  styles.stepLine,
                  currentStep > step && styles.stepLineActive,
                ]}
              />
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );

  const renderStep1 = () => (
    <Animatable.View animation="fadeInRight" duration={500}>
      <Text style={styles.stepTitle}>Personal Information</Text>
      
      <Controller
        control={control}
        name="first_name"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="First Name"
            placeholder="Enter your first name"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.first_name?.message}
            leftIcon="person"
            required
          />
        )}
      />

      <Controller
        control={control}
        name="last_name"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Last Name"
            placeholder="Enter your last name"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.last_name?.message}
            leftIcon="person"
            required
          />
        )}
      />

      <Controller
        control={control}
        name="date_of_birth"
        render={({ field: { onChange, value } }) => (
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.datePickerButton}>
            <Text style={styles.datePickerLabel}>Date of Birth *</Text>
            <View style={styles.datePickerInput}>
              <Icon name="calendar-today" size={20} color={Colors.textLight} />
              <Text style={[styles.datePickerValue, !value && styles.datePickerPlaceholder]}>
                {value ? value.toLocaleDateString() : 'Select date of birth'}
              </Text>
            </View>
            {errors.date_of_birth && (
              <Text style={styles.errorText}>{errors.date_of_birth.message}</Text>
            )}
          </TouchableOpacity>
        )}
      />

      <DatePicker
        modal
        open={showDatePicker}
        date={watch('date_of_birth') || new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000)}
        mode="date"
        maximumDate={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000)}
        onConfirm={(date) => {
          setValue('date_of_birth', date);
          setShowDatePicker(false);
        }}
        onCancel={() => setShowDatePicker(false)}
      />

      <View style={styles.genderContainer}>
        <Text style={styles.genderLabel}>Gender *</Text>
        <View style={styles.genderOptions}>
          <TouchableOpacity
            style={[
              styles.genderOption,
              watchGender === 'male' && styles.genderOptionActive,
            ]}
            onPress={() => setValue('gender', 'male')}>
            <Icon
              name="male"
              size={20}
              color={watchGender === 'male' ? Colors.white : Colors.textLight}
            />
            <Text
              style={[
                styles.genderText,
                watchGender === 'male' && styles.genderTextActive,
              ]}>
              Male
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.genderOption,
              watchGender === 'female' && styles.genderOptionActive,
            ]}
            onPress={() => setValue('gender', 'female')}>
            <Icon
              name="female"
              size={20}
              color={watchGender === 'female' ? Colors.white : Colors.textLight}
            />
            <Text
              style={[
                styles.genderText,
                watchGender === 'female' && styles.genderTextActive,
              ]}>
              Female
            </Text>
          </TouchableOpacity>
        </View>
        {errors.gender && (
          <Text style={styles.errorText}>{errors.gender.message}</Text>
        )}
      </View>

      <Button
        title="Next"
        onPress={nextStep}
        icon="arrow-forward"
        iconPosition="right"
      />
    </Animatable.View>
  );

  const renderStep2 = () => (
    <Animatable.View animation="fadeInRight" duration={500}>
      <Text style={styles.stepTitle}>Contact Information</Text>
      
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Email Address"
            placeholder="Enter your email"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.email?.message}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="email"
            required
          />
        )}
      />

      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Phone Number"
            placeholder="080XXXXXXXX"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.phone?.message}
            keyboardType="phone-pad"
            leftIcon="phone"
            required
          />
        )}
      />

      <Controller
        control={control}
        name="address"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Address"
            placeholder="Enter your address"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.address?.message}
            leftIcon="home"
            multiline
            numberOfLines={3}
            required
          />
        )}
      />

      <Controller
        control={control}
        name="city"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="City"
            placeholder="Enter your city"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.city?.message}
            leftIcon="location-city"
            required
          />
        )}
      />

      <Controller
        control={control}
        name="state"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="State"
            placeholder="Enter your state"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.state?.message}
            leftIcon="map"
            required
          />
        )}
      />

      <View style={styles.buttonRow}>
        <Button
          title="Back"
          onPress={previousStep}
          variant="outline"
          style={styles.halfButton}
          fullWidth={false}  // Add this prop
        />
        <Button
          title="Next"
          onPress={nextStep}
          icon="arrow-forward"
          iconPosition="right"
          style={styles.halfButton}
          fullWidth={false}  // Add this prop
        />
      </View>
    </Animatable.View>
  );

  const renderStep3 = () => (
    <Animatable.View animation="fadeInRight" duration={500}>
      <Text style={styles.stepTitle}>Security Information</Text>
      
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Password"
            placeholder="Enter a strong password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.password?.message}
            secureTextEntry={!showPassword}
            leftIcon="lock"
            rightIcon={showPassword ? 'visibility-off' : 'visibility'}
            onRightIconPress={() => setShowPassword(!showPassword)}
            required
          />
        )}
      />

      <Controller
        control={control}
        name="password_confirmation"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.password_confirmation?.message}
            secureTextEntry={!showConfirmPassword}
            leftIcon="lock"
            rightIcon={showConfirmPassword ? 'visibility-off' : 'visibility'}
            onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
            required
          />
        )}
      />

      <TouchableOpacity
        style={styles.termsContainer}
        onPress={() => setValue('terms', !watchTerms)}>
        <View style={styles.checkbox}>
          {watchTerms && (
            <Icon name="check" size={16} color={Colors.primary} />
          )}
        </View>
        <Text style={styles.termsText}>
          I agree to the{' '}
          <Text style={styles.termsLink}>Terms and Conditions</Text> and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </TouchableOpacity>
      {errors.terms && (
        <Text style={styles.errorText}>{errors.terms.message}</Text>
      )}

      <View style={styles.buttonRow}>
        <Button
          title="Back"
          onPress={previousStep}
          variant="outline"
          style={styles.halfButton}
          fullWidth={false}  // Add this prop
        />
        <Button
          title="Register"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          style={styles.halfButton}
          gradient
          fullWidth={false}  // Add this prop
        />
      </View>
    </Animatable.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}>
              <Icon name="arrow-back" size={24} color={Colors.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Account</Text>
            <View style={{ width: 40 }} />
          </View>

          {renderStepIndicator()}

          <View style={styles.formContainer}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing.xl * 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
  },
  stepIndicatorContainer: {
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepItem: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: Colors.primary,
  },
  stepNumber: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.textLight,
  },
  stepNumberActive: {
    color: Colors.white,
  },
  stepLine: {
    width: 60,
    height: 2,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.xs,
  },
  stepLineActive: {
    backgroundColor: Colors.primary,
  },
  formContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  stepTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  datePickerButton: {
    marginBottom: Spacing.lg,
  },
  datePickerLabel: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  datePickerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
  },
  datePickerValue: {
    marginLeft: Spacing.sm,
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.text,
    flex: 1,
  },
  datePickerPlaceholder: {
    color: Colors.textLight,
  },
  genderContainer: {
    marginBottom: Spacing.lg,
  },
  genderLabel: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  genderOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.white,
    marginHorizontal: 4,
  },
  genderOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  genderText: {
    marginLeft: Spacing.xs,
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.textLight,
  },
  genderTextActive: {
    color: Colors.white,
  },
  buttonRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: Spacing.lg,
  gap: Spacing.sm, // Add gap between buttons
},
  halfButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 4,
    marginRight: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.text,
    lineHeight: 20,
  },
  termsLink: {
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  errorText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  footerText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  footerLink: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.primary,
  },
});

export default RegisterScreen;
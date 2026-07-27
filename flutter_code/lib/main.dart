import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'core/theme/app_theme.dart';
import 'features/auth/data/datasources/auth_remote_data_source.dart';
import 'features/auth/data/repositories/auth_repository_impl.dart';
import 'features/auth/domain/usecases/auth_usecases.dart';
import 'features/auth/presentation/controllers/auth_controller.dart';
import 'features/auth/presentation/screens/auth_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  // Dependency Injection Setup
  final remoteDataSource = AuthRemoteDataSourceImpl();
  final repository = AuthRepositoryImpl(remoteDataSource: remoteDataSource);

  final loginWithPasswordUseCase = LoginWithPasswordUseCase(repository);
  final sendOtpUseCase = SendOtpUseCase(repository);
  final verifyOtpUseCase = VerifyOtpUseCase(repository);

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (_) => AuthController(
            loginWithPasswordUseCase: loginWithPasswordUseCase,
            sendOtpUseCase: sendOtpUseCase,
            verifyOtpUseCase: verifyOtpUseCase,
          ),
        ),
      ],
      child: const ApnaMandlaApp(),
    ),
  );
}

class ApnaMandlaApp extends StatelessWidget {
  const ApnaMandlaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Apna Mandla',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: AuthScreen(
        onLoginSuccess: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Login Successful! Welcome to Apna Mandla.'),
              backgroundColor: Colors.green,
            ),
          );
        },
      ),
    );
  }
}

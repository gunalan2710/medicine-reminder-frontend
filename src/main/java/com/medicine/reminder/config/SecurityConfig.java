package com.medicine.reminder.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            // ⭐ Enable CORS with custom configuration
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                    // ✅ Allow all OPTIONS requests (preflight)
                    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                    // ✅ Public endpoints
                    .requestMatchers(
                            "/",
                            "/health",
                            "/actuator/**",
                            "/api/auth/**",
                            "/api/test/**",
                            "/swagger-ui/**",
                            "/v3/api-docs/**",
                            "/swagger-ui.html"
                    ).permitAll()
                    // 🔒 All other requests need authentication
                    .anyRequest().authenticated()
            )
            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // 🔥 Allow all origins (for development/testing)
        configuration.setAllowedOrigins(List.of("*"));
        
        // 🔐 For PRODUCTION with credentials, use specific origins instead:
        // configuration.setAllowedOrigins(List.of(
        //     "https://ui-mediremind-production.up.railway.app",
        //     "https://your-frontend-domain.com",
        //     "http://localhost:3000",
        //     "http://localhost:5173"
        // ));
        // configuration.setAllowCredentials(true);
        
        // ✅ Allow all HTTP methods
        configuration.setAllowedMethods(List.of(
            "GET", 
            "POST", 
            "PUT", 
            "DELETE", 
            "OPTIONS", 
            "PATCH",
            "HEAD"
        ));
        
        // ✅ Allow all headers
        configuration.setAllowedHeaders(List.of("*"));
        
        // ✅ Expose headers that frontend can read
        configuration.setExposedHeaders(List.of(
            "Authorization", 
            "Content-Type",
            "X-Total-Count",
            "X-Request-Id"
        ));
        
        // ✅ No credentials for wildcard origin
        configuration.setAllowCredentials(false);
        
        // ✅ Cache preflight response for 1 hour
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

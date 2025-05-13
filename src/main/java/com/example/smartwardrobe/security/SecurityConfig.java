package com.example.smartwardrobe.security;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;
@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return web -> web.ignoring()
                .requestMatchers("/images/**", "/uploads/**", "/error");
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(request -> {
                    var cfg = new CorsConfiguration();
                    cfg.setAllowedOrigins(List.of("http://localhost:3001"));
                    cfg.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS", "PATCH"));
                    cfg.setAllowedHeaders(List.of("*"));
                    cfg.setAllowCredentials(true);
                    return cfg;
                }))
                .csrf(AbstractHttpConfigurer::disable)
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((req, res, authEx) ->
                                res.sendError(HttpServletResponse.SC_UNAUTHORIZED))
                        .accessDeniedHandler((req, res, deniedEx) ->
                                res.sendError(HttpServletResponse.SC_FORBIDDEN))
                )
                .authorizeHttpRequests(auth -> auth
                        // permităm /error pentru handling
                        .requestMatchers("/error").permitAll()
                        // login/register
                        .requestMatchers("/api/auth/**").permitAll()
                        // static assets
                        .requestMatchers(HttpMethod.GET, "/images/**", "/uploads/**").permitAll()
                        // CORS preflight + outfit endpoints
                        .requestMatchers(HttpMethod.OPTIONS, "/api/outfit/**").permitAll()
                        .requestMatchers(HttpMethod.POST,   "/api/outfit/**").permitAll()
                        .requestMatchers(HttpMethod.GET,    "/api/outfit/**").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/api/events/**").permitAll()
                        .requestMatchers(HttpMethod.PATCH,   "/api/events/**").permitAll()
                        // orice altceva cere JWT
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}

package com.example.smartwardrobe.security;

import com.example.smartwardrobe.model.User;
import com.example.smartwardrobe.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserService userService;

    public JwtAuthenticationFilter(JwtUtil jwtUtil,
                                   UserService userService) {
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    /**
     * Exclude preflight OPTIONS şi toate cererile de salvare outfit din logica JWT.
     */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        String method = request.getMethod();

        // Exclude toate preflight-urile CORS
        if (HttpMethod.OPTIONS.matches(method)) {
            return true;
        }
        // Exclude exact POST/GET/etc pe /api/outfit şi subruta
        if (HttpMethod.POST.matches(method)
                && (path.equals("/api/outfit") || path.startsWith("/api/outfit/"))) {
            return true;
        }
        return false;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain chain)
            throws IOException, ServletException {

        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header == null || !header.startsWith("Bearer ")) {
            // nu avem token => continuăm fără autentificare
            chain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);
        try {
            if (StringUtils.hasText(token) && jwtUtil.validateToken(token)) {
                String email = jwtUtil.getUsernameFromToken(token);
                Long uid = jwtUtil.getUidFromToken(token);
                User user = userService.findById(uid);

                var auth = new UsernamePasswordAuthenticationToken(
                        user, null, List.of()
                );
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        } catch (Exception ex) {
            // dacă JWT invalid => răspundem 401
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            return;
        }

        // dacă totul e OK sau nu avem token, continuăm lanțul de filtre
        chain.doFilter(request, response);
    }
}

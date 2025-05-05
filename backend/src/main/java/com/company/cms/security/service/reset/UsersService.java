package com.company.cms.security.service.reset;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.company.cms.model.User;
import com.company.cms.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    public void updatePassword(User user, String newPassword) {
        // Encoder le nouveau mot de passe
        user.setPassword(encoder.encode(newPassword));

        // Sauvegarder l'utilisateur
        userRepository.save(user);
    }
}
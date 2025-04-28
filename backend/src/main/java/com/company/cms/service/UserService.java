package com.company.cms.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.company.cms.dto.MessageResponse;
import com.company.cms.model.User;
import com.company.cms.repository.UserRepository;
import com.company.cms.security.service.impl.UserDetailsImpl;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public Optional<User> getCurrentUserProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        return userRepository.findById(userDetails.getId());
    }

    public MessageResponse updateUserProfile(User userDetails) {
        Optional<User> currentUser = getCurrentUserProfile();

        if (currentUser.isPresent()) {
            User user = currentUser.get();

            // Mise à jour des informations de l'utilisateur
            if (userDetails.getEmail() != null) {
                user.setEmail(userDetails.getEmail());
            }

            // Autres mises à jour si nécessaire...

            userRepository.save(user);
            return new MessageResponse("Profile updated successfully");
        } else {
            return new MessageResponse("Error: User not found");
        }
    }
}
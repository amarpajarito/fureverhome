package com.fureverhome.config;

import com.fureverhome.model.Dog;
import com.fureverhome.model.User;
import com.fureverhome.repository.DogRepository;
import com.fureverhome.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final DogRepository dogRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            // Create admin user if not exists
            if (!userRepository.existsByEmail("admin@fureverhome.com")) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@fureverhome.com");
                admin.setPasswordHash(passwordEncoder.encode("admin123"));
                admin.setRole(User.Role.ADMIN);
                userRepository.save(admin);
                System.out.println("Admin user created: admin@fureverhome.com / admin123");
            }

            // Create test user if not exists
            if (!userRepository.existsByEmail("user@test.com")) {
                User user = new User();
                user.setUsername("testuser");
                user.setEmail("user@test.com");
                user.setPasswordHash(passwordEncoder.encode("password123"));
                user.setRole(User.Role.USER);
                userRepository.save(user);
                System.out.println("Test user created: user@test.com / password123");
            }

            // Create sample dogs if database is empty
            if (dogRepository.count() == 0) {
                Dog dog1 = new Dog();
                dog1.setName("Max");
                dog1.setBreed("Golden Retriever");
                dog1.setAge(3);
                dog1.setGender(Dog.Gender.MALE);
                dog1.setDescription("Friendly and energetic Golden Retriever. Great with kids and loves to play fetch!");
                dog1.setHealthStatus("Healthy");
                dog1.setImageUrl("https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400&h=300&fit=crop");
                dog1.setAvailable(true);
                dogRepository.save(dog1);

                Dog dog2 = new Dog();
                dog2.setName("Bella");
                dog2.setBreed("Labrador Retriever");
                dog2.setAge(2);
                dog2.setGender(Dog.Gender.FEMALE);
                dog2.setDescription("Sweet and gentle Labrador. Loves cuddles and long walks in the park.");
                dog2.setHealthStatus("Healthy");
                dog2.setImageUrl("https://images.unsplash.com/photo-1591769225440-811ad7d6eab3?w=400&h=300&fit=crop");
                dog2.setAvailable(true);
                dogRepository.save(dog2);

                Dog dog3 = new Dog();
                dog3.setName("Charlie");
                dog3.setBreed("Beagle");
                dog3.setAge(4);
                dog3.setGender(Dog.Gender.MALE);
                dog3.setDescription("Curious and playful Beagle. Great nose for tracking and loves adventures!");
                dog3.setHealthStatus("Healthy");
                dog3.setImageUrl("https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=400&h=300&fit=crop");
                dog3.setAvailable(true);
                dogRepository.save(dog3);

                Dog dog4 = new Dog();
                dog4.setName("Lucy");
                dog4.setBreed("German Shepherd");
                dog4.setAge(5);
                dog4.setGender(Dog.Gender.FEMALE);
                dog4.setDescription("Loyal and intelligent German Shepherd. Well-trained and protective.");
                dog4.setHealthStatus("Healthy");
                dog4.setImageUrl("https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=400&h=300&fit=crop");
                dog4.setAvailable(true);
                dogRepository.save(dog4);

                Dog dog5 = new Dog();
                dog5.setName("Rocky");
                dog5.setBreed("Bulldog");
                dog5.setAge(3);
                dog5.setGender(Dog.Gender.MALE);
                dog5.setDescription("Calm and affectionate Bulldog. Perfect for apartment living.");
                dog5.setHealthStatus("Healthy");
                dog5.setImageUrl("https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=300&fit=crop");
                dog5.setAvailable(true);
                dogRepository.save(dog5);

                Dog dog6 = new Dog();
                dog6.setName("Daisy");
                dog6.setBreed("Poodle");
                dog6.setAge(2);
                dog6.setGender(Dog.Gender.FEMALE);
                dog6.setDescription("Smart and hypoallergenic Poodle. Great for families with allergies.");
                dog6.setHealthStatus("Healthy");
                dog6.setImageUrl("https://images.unsplash.com/photo-1616606103915-dea7be788566?w=400&h=300&fit=crop");
                dog6.setAvailable(true);
                dogRepository.save(dog6);

                Dog dog7 = new Dog();
                dog7.setName("Luna");
                dog7.setBreed("Siberian Husky");
                dog7.setAge(2);
                dog7.setGender(Dog.Gender.FEMALE);
                dog7.setDescription("Beautiful blue-eyed Husky with a playful personality. Loves snow and outdoor activities. Very social and gets along well with other dogs.");
                dog7.setHealthStatus("Healthy");
                dog7.setImageUrl("https://images.unsplash.com/photo-1568572933382-74d440642117?w=400&h=300&fit=crop");
                dog7.setAvailable(true);
                dogRepository.save(dog7);

                Dog dog8 = new Dog();
                dog8.setName("Shadow");
                dog8.setBreed("Border Collie");
                dog8.setAge(3);
                dog8.setGender(Dog.Gender.MALE);
                dog8.setDescription("Highly intelligent and energetic Border Collie. Excellent for active families who enjoy training and outdoor activities. Knows several tricks!");
                dog8.setHealthStatus("Healthy");
                dog8.setImageUrl("https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop");
                dog8.setAvailable(true);
                dogRepository.save(dog8);

                Dog dog9 = new Dog();
                dog9.setName("Biscuit");
                dog9.setBreed("Welsh Corgi");
                dog9.setAge(1);
                dog9.setGender(Dog.Gender.MALE);
                dog9.setDescription("Adorable young Corgi with short legs and big personality! Very friendly, loves treats, and enjoys being the center of attention.");
                dog9.setHealthStatus("Healthy");
                dog9.setImageUrl("https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=400&h=300&fit=crop");
                dog9.setAvailable(true);
                dogRepository.save(dog9);

                Dog dog10 = new Dog();
                dog10.setName("Mochi");
                dog10.setBreed("Shiba Inu");
                dog10.setAge(4);
                dog10.setGender(Dog.Gender.FEMALE);
                dog10.setDescription("Independent and spirited Shiba Inu with fox-like features. Clean and quiet, perfect for apartment living. Loves her daily walks!");
                dog10.setHealthStatus("Healthy");
                dog10.setImageUrl("https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=400&h=300&fit=crop");
                dog10.setAvailable(true);
                dogRepository.save(dog10);

                Dog dog11 = new Dog();
                dog11.setName("Oscar");
                dog11.setBreed("Dachshund");
                dog11.setAge(5);
                dog11.setGender(Dog.Gender.MALE);
                dog11.setDescription("Charming long-bodied Dachshund with a brave heart. Great companion dog, loves to burrow under blankets and snuggle.");
                dog11.setHealthStatus("Healthy");
                dog11.setImageUrl("https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop");
                dog11.setAvailable(true);
                dogRepository.save(dog11);

                Dog dog12 = new Dog();
                dog12.setName("Blue");
                dog12.setBreed("Australian Shepherd");
                dog12.setAge(2);
                dog12.setGender(Dog.Gender.MALE);
                dog12.setDescription("Stunning merle-colored Australian Shepherd. Very active and needs plenty of exercise. Great for agility training and loves to work!");
                dog12.setHealthStatus("Healthy");
                dog12.setImageUrl("https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=400&h=300&fit=crop");
                dog12.setAvailable(true);
                dogRepository.save(dog12);

                System.out.println("Sample dogs created successfully! Total: " + dogRepository.count() + " dogs");
            }
        };
    }
}


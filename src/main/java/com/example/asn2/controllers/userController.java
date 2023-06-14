package com.example.asn2.controllers;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.example.asn2.models.User;
import com.example.asn2.models.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import jakarta.servlet.http.HttpServletResponse;

@Controller
public class userController {

    @Autowired
    private UserRepository userRepo;

    @GetMapping("/users/mainPage")
    public String getAll(Model model) {
        List<User> users = userRepo.findAll();
        model.addAttribute("us", users);

        return "users/main";
    }

    @PostMapping("/users/add")
    public String addUser(@RequestParam Map<String, String> newuser, HttpServletResponse response) {
        System.out.println("ADD user");
        String newEmail = newuser.get("email");
        String newPwd = newuser.get("password");
        String newName = newuser.get("name");
        int newStudentID = Integer.parseInt(newuser.get("studentID"));
        float newGPA = Float.parseFloat(newuser.get("gpa"));
        int newHeight = Integer.parseInt(newuser.get("height"));
        userRepo.save(new User(newStudentID, newName, newHeight, newGPA, newEmail, newPwd));
        response.setStatus(201);
        return "users/added";

    }

    @PutMapping("/users/{id}")
    public ResponseEntity<String> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        System.out.println("UPDATE user: " + id);
        Optional<User> optionalUser = userRepo.findById(id);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setEmail(updatedUser.getEmail());
            user.setPass(updatedUser.getPass());
            user.setName(updatedUser.getName());
            user.setGpa(updatedUser.getGpa());
            user.setHeight(updatedUser.getHeight());
            userRepo.save(user);
            return ResponseEntity.ok("User successfully edited");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/users/del/{id}")
    public void deleteUser(@PathVariable Long id, HttpServletResponse response) {
        System.out.println("DELETE user: " + id);

        userRepo.deleteById(id);
        // userRepo.delete(user);
        // userRepo.
        // userRepo.delete(studentID);
        // try {
        // userRepo.deleteById(studentID);
        // } catch (Exception e) {
        // e.printStackTrace();
        // }

    }

}

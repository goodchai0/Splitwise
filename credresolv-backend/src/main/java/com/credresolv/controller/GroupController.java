package com.credresolv.controller;

import com.credresolv.entity.Group;
import com.credresolv.entity.GroupMember;
import com.credresolv.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = "http://localhost:3000")
public class GroupController {
    
    @Autowired
    private GroupService groupService;
    
    @PostMapping
    public ResponseEntity<?> createGroup(@RequestBody Map<String, String> request) {
        try {
            Group group = groupService.createGroup(request.get("name"));
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(group));
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    @PostMapping("/{groupId}/members/{userId}")
    public ResponseEntity<?> addMember(
            @PathVariable Long groupId,
            @PathVariable Long userId) {
        try {
            System.out.println("=== Adding member: groupId=" + groupId + ", userId=" + userId);
            groupService.addMemberToGroup(groupId, userId);
            System.out.println("=== Member added successfully");
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Member added successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("=== ERROR adding member ===");
            e.printStackTrace();
            
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
    
    @DeleteMapping("/{groupId}/members/{userId}")
    public ResponseEntity<?> removeMember(
            @PathVariable Long groupId,
            @PathVariable Long userId) {
        try {
            boolean removed = groupService.removeMemberFromGroup(groupId, userId);
            if (removed) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Member removed successfully");
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Cannot remove member with outstanding balances");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getAllGroups() {
        try {
            List<Group> groups = groupService.getAllGroups();
            List<Map<String, Object>> groupDTOs = groups.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
            return ResponseEntity.ok(groupDTOs);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getGroup(@PathVariable Long id) {
        try {
            System.out.println("=== Getting group: id=" + id);
            Group group = groupService.getGroup(id);
            System.out.println("=== Group found: " + group.getName());
            
            Map<String, Object> dto = convertToDTO(group);
            System.out.println("=== DTO created successfully");
            
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            System.err.println("=== ERROR getting group ===");
            e.printStackTrace();
            
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserGroups(@PathVariable Long userId) {
        try {
            List<Group> groups = groupService.getUserGroups(userId);
            List<Map<String, Object>> groupDTOs = groups.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
            return ResponseEntity.ok(groupDTOs);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGroup(@PathVariable Long id) {
        try {
            groupService.deleteGroup(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Group deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", "Group not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }
    
    private Map<String, Object> convertToDTO(Group group) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("id", group.getId());
        dto.put("name", group.getName());
        
        List<Map<String, Object>> memberDTOs = new ArrayList<>();
        if (group.getMembers() != null) {
            for (GroupMember gm : group.getMembers()) {
                Map<String, Object> memberDTO = new HashMap<>();
                memberDTO.put("id", gm.getId());
                
                Map<String, Object> userDTO = new HashMap<>();
                userDTO.put("id", gm.getUser().getId());
                userDTO.put("name", gm.getUser().getName());
                userDTO.put("email", gm.getUser().getEmail());
                
                memberDTO.put("user", userDTO);
                memberDTOs.add(memberDTO);
            }
        }
        dto.put("members", memberDTOs);
        
        return dto;
    }
}

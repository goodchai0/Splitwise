package com.credresolv.service;

import com.credresolv.entity.Group;
import com.credresolv.entity.User;
import com.credresolv.repository.GroupRepository;
import com.credresolv.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class GroupService {
    
    @Autowired
    private GroupRepository groupRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public Group createGroup(String name) {
        Group group = new Group();
        group.setName(name);
        return groupRepository.save(group);
    }
    
    public void addMemberToGroup(Long groupId, Long userId) {
        Group group = groupRepository.findById(groupId)
            .orElseThrow(() -> new RuntimeException("Group not found"));
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (group.isMember(userId)) {
            throw new RuntimeException("User is already a member of this group");
        }
        
        group.addMember(user);
        groupRepository.save(group);
    }
    
    public boolean removeMemberFromGroup(Long groupId, Long userId) {
        Group group = groupRepository.findById(groupId)
            .orElseThrow(() -> new RuntimeException("Group not found"));
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        group.removeMember(user);
        groupRepository.save(group);
        return true;
    }
    
    public List<Group> getAllGroups() {
        return groupRepository.findAll();
    }
    
    public Group getGroup(Long id) {
        return groupRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Group not found"));
    }
    
    public List<Group> getUserGroups(Long userId) {
        return groupRepository.findAll().stream()
            .filter(group -> group.isMember(userId))
            .collect(Collectors.toList());
    }
    
    public void deleteGroup(Long id) {
        if (!groupRepository.existsById(id)) {
            throw new RuntimeException("Group not found");
        }
        groupRepository.deleteById(id);
    }
}

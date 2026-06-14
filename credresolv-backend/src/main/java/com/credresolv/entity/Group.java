package com.credresolv.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "groups")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = {"members", "expenses"})
@ToString(exclude = {"members", "expenses"})
public class Group {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference
    private Set<GroupMember> members = new HashSet<>();
    
    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<Expense> expenses = new HashSet<>();
    
    public Group(String name) {
        this.name = name;
    }
    

    public void addMember(User user) {
        GroupMember membership = new GroupMember();
        membership.setGroup(this);
        membership.setUser(user);
        members.add(membership);
    }
    
    public void removeMember(User user) {
        members.removeIf(gm -> gm.getUser().getId().equals(user.getId()));
    }
    
    public boolean isMember(Long userId) {
        return members.stream()
                .anyMatch(gm -> gm.getUser().getId().equals(userId));
    }
}

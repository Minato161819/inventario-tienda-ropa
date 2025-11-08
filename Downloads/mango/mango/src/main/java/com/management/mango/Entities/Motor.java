package com.management.mango.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "motor")
public class Motor
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private int cantidad;

    @Column(nullable = false)
    private int potencia;

    @Column(nullable = false)
    private int cilindrada;

    @Column(nullable = false)
    private String tipo_motor;
}

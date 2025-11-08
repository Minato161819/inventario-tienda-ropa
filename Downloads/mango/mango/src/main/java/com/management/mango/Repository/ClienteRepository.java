package com.management.mango.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.management.mango.Entities.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Long>{ }

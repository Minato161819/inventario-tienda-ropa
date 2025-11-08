package com.management.mango.Service;

import com.management.mango.Entities.Cliente;
import com.management.mango.Entities.Coche;
import com.management.mango.Repository.CocheRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class CocheService
{
    @Autowired
    private CocheRepository cocheRepository;

    public List<Coche> listarTodos() {
        return cocheRepository.findAll();
    }

    public Coche guardar(Coche coche) {
        return cocheRepository.save(coche);
    }

    public Coche obtenerPorId(Long id) {
        return cocheRepository.findById(id).orElse(null);
    }

    public void eliminar(Long id) { cocheRepository.deleteById(id); }
}

package com.management.mango.Controller;

import com.management.mango.Entities.Cliente;
import com.management.mango.Service.ClienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/clientes")
@RequiredArgsConstructor
public class ClienteController
{
    private final ClienteService clienteService;

    @GetMapping({"/nuevo", "/editar/{id}"})
    public String form(@PathVariable(required = false) Long id, Model m) {
        m.addAttribute("cliente", id == null ? new Cliente() : clienteService.obtenerPorId(id));
        return "formulario";
    }
}

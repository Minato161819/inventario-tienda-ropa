package com.management.mango.Controller;

import com.management.mango.Entities.Cliente;
import com.management.mango.Entities.Coche;
import com.management.mango.Service.CocheService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/coches")
@RequiredArgsConstructor
public class CocheController
{
    private final CocheService cocheService;

    @GetMapping("/")
    public String home() {
        return "main";
    }

    @GetMapping
    public String listar(Model m) {
        m.addAttribute("coches", cocheService.listarTodos());
        return "lista";
    }

    @GetMapping({"/nuevo", "/editar/{id}"})
    public String form(@PathVariable(required = false) Long id, Model m) {
        m.addAttribute("coche", id == null ? new Cliente() : cocheService.obtenerPorId(id));
        return "formulario";
    }

    @PostMapping
    public String guardar(@ModelAttribute Coche p, BindingResult r) {
        if (r.hasErrors()) return "formulario";
        cocheService.guardar(p);
        return "redirect:/coches";
    }

    @GetMapping("/eliminar/{id}")
    public String eliminar(@PathVariable Long id) {
        cocheService.eliminar(id);
        return "redirect:/coches";
    }
}

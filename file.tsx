// Reglas implementadas
if (client.plan === 1 || client.plan === 2) {
  return false; // No recibe notificaciones
} else if (client.plan === 3 && settings.enabled) {
  return true; // Recibe notificaciones si está activado
}
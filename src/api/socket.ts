import { io } from 'socket.io-client';

// L'URL pointera vers le serveur de votre équipe (ici par défaut le port 8000)
const URL = 'http://localhost:8000';

export const socket = io(URL, {
  autoConnect: false, // On ne se connecte que lorsque la commande est passée
  reconnection: true,
});
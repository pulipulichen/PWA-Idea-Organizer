# Shared helper: pick docker-compose or docker compose, and whether sudo is needed.
# Sets COMPOSE_CMD, e.g. "docker-compose", "sudo docker compose".

_docker_ok() {
  docker info >/dev/null 2>&1
}

_sudo_docker_ok() {
  sudo docker info >/dev/null 2>&1
}

if _docker_ok; then
  _SUDO=""
elif _sudo_docker_ok; then
  _SUDO="sudo "
else
  echo "Error: Docker is not available (tried with and without sudo)." >&2
  exit 1
fi

if command -v docker-compose >/dev/null 2>&1 && ${_SUDO}docker-compose version >/dev/null 2>&1; then
  COMPOSE_CMD="${_SUDO}docker-compose"
elif ${_SUDO}docker compose version >/dev/null 2>&1; then
  COMPOSE_CMD="${_SUDO}docker compose"
else
  echo "Error: neither docker-compose nor docker compose is available." >&2
  exit 1
fi

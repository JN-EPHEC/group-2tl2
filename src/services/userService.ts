import User from "../models/User";

export async function getAllUsers() {
  return User.findAll();
}

export async function createUser(nom: string, prenom: string) {
  return User.create({ nom, prenom });
}

export async function deleteUser(id: number) {
  return User.destroy({ where: { id } });
}

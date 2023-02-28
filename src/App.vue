<script setup lang="ts">
import axios from "axios";
import { ref } from "vue";
import Keycloak from "keycloak-js";

import { useToast } from "./useToast";

const fruitsArray = ref([]);
const AccessToken = ref<string | null | undefined>(null);

const { toasts, pushToast } = useToast();

interface IPerson {
  role: string;
  lastName: string;
  firstName: string;
};

type DefaultValues = Pick<IPerson, "role">;

const defaultPersonValues: DefaultValues = {
  role: "guest",
};

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

type PersonWithDefaultsOptional = Optional<IPerson, keyof DefaultValues>;

const newPerson: PersonWithDefaultsOptional = {
  lastName: "Lazic",
  firstName: "Marko",
};

const person: IPerson = {
  ...defaultPersonValues,
  ...newPerson,
};

console.log(person);

interface IExpiration {
  days: number;
  hours: number;
  minutes: number;
};

const expirationTime = ref<IExpiration>({
  days: 0,
  hours: 0,
  minutes: 0,
});

type SetExpiration = (key: keyof IExpiration, val: number) => void;
const setExpiration: SetExpiration = (key, val) => expirationTime.value[key] = val;

console.log({ ...expirationTime.value });
setExpiration("hours", 12);
console.log({ ...expirationTime.value });

const authenticate = async () => {
  const kcOptions = {
    url: "http://localhost:8080",
    realm: "AuthSrvTest",
    clientId: "vueclient",
    "public-client": true,
    "verify-token-audience": false,
  };

  const keycloak = new Keycloak(kcOptions);

  AccessToken.value = "Authenticating...";

  const auth = await keycloak.init({ onLoad: "login-required" });

  if (!auth) window.location.reload();
  else console.log("Authenticated!");

  console.log(AccessToken.value);

  if (keycloak.token) localStorage.setItem("keycloakToken", keycloak.token);
};

const getData = async () => {
  const response = await axios.get("http://localhost:5171/fruit", {
    headers: {
      Authorization: "Bearer SOME_TOKEN",
    },
  });

  fruitsArray.value = response.data;
};

getData();
</script>

<template>
  <!-- {{ fruitsArray }} -->
  {{ toasts }}<br/>

  <img v-if="fruitsArray.length" src="http://localhost:5171/fruit" alt="img" height="0" width="0">

  <button @click="() => pushToast({ message: 'lol 1', class: 'success', delay: 2000 })">Add 1</button>
  <button @click="() => pushToast({ message: 'lol 2', class: 'success', delay: 3000 })">Add 2</button>
  <button @click="() => pushToast({ message: 'lol 3', class: 'success', delay: 4000 })">Add 3</button>

  <!-- <button @click="authenticate">Authenticate</button> -->
</template>

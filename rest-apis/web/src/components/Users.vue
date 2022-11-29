<template>
  <div class="p-4">
    <div class="modal fade" id="userModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="staticBackdropLabel">User</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3 row">
              <label for="staticEmail" class="col-sm-4 col-form-label">First Name</label>
              <div class="col-sm-8">
                <input type="text" class="form-control" id="staticEmail" v-model="user.firstName" />
              </div>
            </div>
            <div class="mb-3 row">
              <label for="inputPassword" class="col-sm-4 col-form-label">Last Name</label>
              <div class="col-sm-8">
                <input type="text" class="form-control" id="inputPassword" v-model="user.lastName" />
              </div>
            </div>
            <div class="mb-3 row">
              <label for="staticEmail" class="col-sm-4 col-form-label">Email</label>
              <div class="col-sm-8">
                <input type="email" class="form-control" id="staticEmail" v-model="user.email" />
              </div>
            </div>
            <div class="mb-3 row">
              <label for="inputPassword" class="col-sm-4 col-form-label">Password</label>
              <div class="col-sm-8">
                <input type="password" class="form-control" id="inputPassword" v-model="user.password" />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="submitUser()">Save</button>
          </div>
        </div>
      </div>
    </div>

    <div class="text-end">
      <button class="btn btn-success" @click="openUserModal()">Create New User</button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">First Name</th>
          <th scope="col">Last Name</th>
          <th scope="col">Email</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) of users" :key="index">
          <th scope="row">{{ index + 1 }}</th>
          <td>{{ user.firstName }}</td>
          <td>{{ user.lastName }}</td>
          <td>{{ user.email }}</td>
          <td>
            <button class="btn btn-warning" @click="showUpdateModal(user)">Edit</button>
            <button class="btn btn-danger ms-2" @click="deleteUser(user)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';
import { Modal } from 'bootstrap';

export default {
  name: 'UsersComponent',
  data() {
    return {
      users: [],
      user: {},
    };
  },
  mounted() {
    this.getAllUsers();
  },
  methods: {
    async getAllUsers() {
      try {
        const response = await axios.get('users');
        this.users = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async createUser() {
      try {
        await axios.post('users', this.user);
        this.getAllUsers();
      } catch (error) {
        console.error(error);
      }
    },
    async updateUser(user) {
      try {
        await axios.put(`users/${user._id}`, user);
        this.getAllUsers();
      } catch (error) {
        console.error(error);
      }
    },
    async deleteUser(user) {
      try {
        await axios.delete(`users/${user._id}`, user);
        this.getAllUsers();
      } catch (error) {
        console.error(error);
      }
    },
    submitUser() {
      if (this.user._id) {
        this.updateUser(this.user);
      } else {
        this.createUser(this.user);
      }
      // this.closeUserModal();
    },
    openUserModal() {
      new Modal('#userModal').show();
    },
    closeUserModal() {
      new Modal('#userModal').hide();
    },
    showUpdateModal(user) {
      this.user = JSON.parse(JSON.stringify(user));
      this.openUserModal();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

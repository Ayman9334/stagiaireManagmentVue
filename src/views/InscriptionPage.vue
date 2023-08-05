<script setup></script>

<template>
  <section class="Insciption vh-100 w-100 d-flex justify-content-center align-items-center">
    <form class="p-3 rounded">
      <div class="h2">
        Connecter vous :
      </div>
      <hr>
      <div class="mb-3">
        <label for="exampleInputEmail1" class="form-label">Login</label>
        <input
          type="Login"
          class="form-control"
          id="exampleInputEmail1"
        />
      </div>
      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label">Password</label>
        <input type="password" class="form-control" id="exampleInputPassword1" />
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </section>
</template>

<style scoped>
.Insciption{
    background-image: url("../assets/background.jpg");
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    background-attachment: fixed;
}
.Insciption form{
    width: 500px;
    max-width: 90%;
    background-color: rgba(255, 255, 255, 0.825);
    box-shadow: 2px 4px 4px rgba(0, 0, 0, 0.156);
    font-weight: 500;
}
</style>
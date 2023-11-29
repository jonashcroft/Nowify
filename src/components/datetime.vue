<div id="app">
  <p>Current Datetime: {{ currentDatetime }}</p>
</div>

<script>
// Vue instance
new Vue({
  el: '#app',
  data: {
    currentDatetime: ''
  },
  mounted() {
    // Update the currentDatetime property every second
    this.updateDatetime();
    setInterval(this.updateDatetime, 1000);
  },
  methods: {
    updateDatetime() {
      // Get the current date and time
      const now = new Date();
      // Format the date and time
      const formattedDatetime = now.toLocaleString();
      // Update the currentDatetime property
      this.currentDatetime = formattedDatetime;
    }
  }
});
</script>

</body>
</html>

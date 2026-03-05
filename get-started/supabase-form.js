(function () {
  "use strict";

  var SUPABASE_URL = window.SUPABASE_URL || "https://mwyvtxiwycfvbdcwjmjb.supabase.co";
  var SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13eXZ0eGl3eWNmdmJkY3dqbWpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2OTY3MTEsImV4cCI6MjA4ODI3MjcxMX0.1J10E34ZDLU2VM5UUr7RaPKFnqEYC_z8J1Piaa8aI8o";
  var SUPABASE_TABLE = window.SUPABASE_TABLE || "lead_submissions";

  function isConfigured() {
    return (
      SUPABASE_URL &&
      SUPABASE_ANON_KEY &&
      SUPABASE_URL.indexOf("YOUR_PROJECT_REF") === -1 &&
      SUPABASE_ANON_KEY.indexOf("YOUR_SUPABASE_ANON_KEY") === -1
    );
  }

  function showResult(isSuccess) {
    var done = document.querySelector(".w-form-done");
    var fail = document.querySelector(".w-form-fail");
    var form = document.getElementById("email-form");
    if (done) done.style.display = isSuccess ? "block" : "none";
    if (fail) fail.style.display = isSuccess ? "none" : "block";
    if (form && isSuccess) form.style.display = "none";
  }

  function getValue(formData, key) {
    var value = formData.get(key);
    return typeof value === "string" ? value.trim() : "";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("email-form");
    if (!form) return;

    if (!window.supabase || !window.supabase.createClient) {
      console.error("Supabase client script is not loaded.");
      return;
    }

    if (!isConfigured()) {
      console.warn("Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY.");
      return;
    }

    var client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      var submitBtn = form.querySelector('input[type="submit"], button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      var formData = new FormData(form);
      var hearAboutUs = getValue(formData, "Hear-About-Us");
      var payload = {
        first_name: getValue(formData, "First-Name"),
        last_name: getValue(formData, "Last-Name"),
        work_email: getValue(formData, "email"),
        phone_number: getValue(formData, "Phone"),
        company_name: getValue(formData, "Company-name"),
        job_title: getValue(formData, "Job-Title"),
        annual_revenue: getValue(formData, "Annual-Revenue"),
        services: getValue(formData, "Services"),
        specific_needs: getValue(formData, "Specific-needs"),
        hear_about_us: hearAboutUs,
        other_details: hearAboutUs === "Other" ? getValue(formData, "Other") : "",
        source_page: window.location.pathname,
      };

      try {
        var result = await client.from(SUPABASE_TABLE).insert([payload]);
        if (result.error) throw result.error;
        showResult(true);
        form.reset();
      } catch (error) {
        console.error("Supabase insert failed:", error);
        showResult(false);
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  });
})();

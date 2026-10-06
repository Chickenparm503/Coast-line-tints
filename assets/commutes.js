/* ============ Commutes drive-time widget (Contact page only) ============
   Builds the full "add a destination, see your drive time from our shop"
   experience on top of the Commutes HTML scaffold: map, address
   autocomplete, travel-mode selection, and Google Directions lookups.
============================================================================ */

const SHOP_ADDRESS = "33545 George Ferguson Way, Abbotsford, BC, Canada";

const MODE_ICON = {
  DRIVING: "commutes-driving-icon",
  TRANSIT: "commutes-transit-icon",
  BICYCLING: "commutes-bicycling-icon",
  WALKING: "commutes-walking-icon",
};

class Commutes {
  constructor(config) {
    this.config = config;
    this.destinations = []; // {id, address, mode, duration, renderer}
    this.nextId = 1;
    this.editingId = null;
    this.shopLatLng = null;

    this.els = {
      mapView: document.querySelector(".map-view"),
      initialState: document.querySelector(".commutes-initial-state"),
      destinationsState: document.querySelector(".commutes-destinations"),
      destinationList: document.querySelector(".destination-list"),
      destinationsContainer: document.querySelector(".destinations-container"),
      leftControl: document.querySelector(".left-control"),
      rightControl: document.querySelector(".right-control"),
      modalContainer: document.querySelector(".commutes-modal-container"),
      form: document.getElementById("destination-form"),
      addressInput: document.getElementById("destination-address-input"),
      errorMessage: document.querySelector(".error-message"),
      addButtons: document.querySelectorAll(".add-button"),
      cancelButton: document.querySelector(".cancel-button"),
      addDestButton: document.querySelector(".add-destination-button"),
      editDestButton: document.querySelector(".edit-destination-button"),
      deleteDestButton: document.querySelector(".delete-destination-button"),
      modalHeading: document.getElementById("add-edit-heading"),
    };

    this.geocoder = new google.maps.Geocoder();
    this.directionsService = new google.maps.DirectionsService();
    this.placesAutocomplete = null;
    this.selectedPlace = null;

    this.initMapAndShop();
    this.bindEvents();
  }

  initMapAndShop() {
    this.map = new google.maps.Map(this.els.mapView, this.config.mapOptions);

    this.geocoder.geocode({ address: SHOP_ADDRESS }, (results, status) => {
      if (status === "OK" && results[0]) {
        this.shopLatLng = results[0].geometry.location;
      } else {
        this.shopLatLng = new google.maps.LatLng(
          this.config.mapOptions.center.lat,
          this.config.mapOptions.center.lng
        );
      }
      this.map.setCenter(this.shopLatLng);
      new google.maps.Marker({
        position: this.shopLatLng,
        map: this.map,
        title: "Coastline Customs",
      });
    });

    this.placesAutocomplete = new google.maps.places.Autocomplete(this.els.addressInput, {
      fields: ["formatted_address", "geometry", "name"],
    });
    this.placesAutocomplete.bindTo("bounds", this.map);
    this.placesAutocomplete.addListener("place_changed", () => {
      const place = this.placesAutocomplete.getPlace();
      this.selectedPlace = place && place.geometry ? place : null;
      this.setError("");
    });
  }

  bindEvents() {
    this.els.addButtons.forEach((btn) => {
      btn.addEventListener("click", () => this.openModal(null));
    });

    this.els.modalContainer.addEventListener("click", (e) => {
      if (e.target === this.els.modalContainer) this.closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.els.modalContainer.classList.contains("open")) {
        this.closeModal();
      }
    });

    this.els.cancelButton.addEventListener("click", (e) => {
      e.preventDefault();
      this.closeModal();
    });
    this.els.deleteDestButton.addEventListener("click", (e) => {
      e.preventDefault();
      if (this.editingId != null) this.removeDestination(this.editingId);
      this.closeModal();
    });
    this.els.addDestButton.addEventListener("click", () => this.submitDestination(null));
    this.els.editDestButton.addEventListener("click", () => this.submitDestination(this.editingId));

    this.els.leftControl.addEventListener("click", () => this.scrollDestinations(-1));
    this.els.rightControl.addEventListener("click", () => this.scrollDestinations(1));
    this.els.destinationList.addEventListener("scroll", () => this.updateScrollControls());
  }

  openModal(destination) {
    this.setError("");
    this.selectedPlace = null;
    this.editingId = destination ? destination.id : null;

    if (destination) {
      this.els.modalHeading.textContent = "Edit destination";
      this.els.addressInput.value = destination.address;
      this.els.deleteDestButton.classList.remove("hide");
      this.els.addDestButton.classList.add("hide");
      this.els.editDestButton.classList.remove("hide");
      const radio = document.querySelector(`input[name="travel-mode"][value="${destination.mode}"]`);
      if (radio) radio.checked = true;
    } else {
      this.els.modalHeading.textContent = "Add destination";
      this.els.form.reset();
      this.els.addressInput.value = "";
      this.els.deleteDestButton.classList.add("hide");
      this.els.addDestButton.classList.remove("hide");
      this.els.editDestButton.classList.add("hide");
      const defaultRadio = document.querySelector(
        `input[name="travel-mode"][value="${this.config.defaultTravelMode}"]`
      );
      if (defaultRadio) defaultRadio.checked = true;
    }

    this.els.modalContainer.classList.add("open");
    window.setTimeout(() => this.els.addressInput.focus(), 50);
  }

  closeModal() {
    this.els.modalContainer.classList.remove("open");
    this.setError("");
    this.editingId = null;
  }

  setError(message) {
    this.els.errorMessage.textContent = message || "";
  }

  getSelectedMode() {
    const checked = document.querySelector('input[name="travel-mode"]:checked');
    return checked ? checked.value : this.config.defaultTravelMode;
  }

  submitDestination(editingId) {
    const address = this.els.addressInput.value.trim();
    if (!address) {
      this.setError("Enter an address to continue.");
      return;
    }
    if (!this.selectedPlace && editingId == null) {
      this.setError("Please choose an address from the suggestions list.");
      return;
    }

    const mode = this.getSelectedMode();
    const destLatLng = this.selectedPlace
      ? this.selectedPlace.geometry.location
      : null;
    const destAddress = this.selectedPlace
      ? this.selectedPlace.formatted_address || address
      : address;

    this.computeRoute(destLatLng, destAddress, mode, (result) => {
      if (!result) return;
      if (editingId != null) {
        this.updateDestination(editingId, result);
      } else {
        this.addDestination(result);
      }
      this.closeModal();
    });
  }

  computeRoute(destLatLng, destAddress, mode, callback) {
    if (!this.shopLatLng) {
      this.setError("Still loading the map — try again in a second.");
      return;
    }
    const request = {
      origin: this.shopLatLng,
      destination: destLatLng || destAddress,
      travelMode: google.maps.TravelMode[mode],
    };
    if (mode === "DRIVING") {
      request.drivingOptions = { departureTime: new Date(), trafficModel: "bestguess" };
    }
    this.directionsService.route(request, (response, status) => {
      if (status !== "OK" || !response.routes[0]) {
        this.setError("Couldn't find a route for that travel mode — try a different one.");
        callback(null);
        return;
      }
      const leg = response.routes[0].legs[0];
      const durationText = (leg.duration_in_traffic || leg.duration).text;
      callback({
        address: leg.end_address || destAddress,
        mode,
        durationText,
        directionsResult: response,
      });
    });
  }

  addDestination(result) {
    const id = this.nextId++;
    const renderer = new google.maps.DirectionsRenderer({
      map: this.map,
      directions: result.directionsResult,
      suppressMarkers: false,
      preserveViewport: this.destinations.length > 0,
    });
    this.destinations.push({
      id,
      address: result.address,
      mode: result.mode,
      durationText: result.durationText,
      renderer,
    });
    this.renderDestinations();
  }

  updateDestination(id, result) {
    const dest = this.destinations.find((d) => d.id === id);
    if (!dest) return;
    dest.renderer.setMap(null);
    dest.renderer = new google.maps.DirectionsRenderer({
      map: this.map,
      directions: result.directionsResult,
      suppressMarkers: false,
      preserveViewport: true,
    });
    dest.address = result.address;
    dest.mode = result.mode;
    dest.durationText = result.durationText;
    this.renderDestinations();
  }

  removeDestination(id) {
    const dest = this.destinations.find((d) => d.id === id);
    if (dest) dest.renderer.setMap(null);
    this.destinations = this.destinations.filter((d) => d.id !== id);
    this.renderDestinations();
  }

  renderDestinations() {
    this.els.destinationList.innerHTML = "";

    if (this.destinations.length === 0) {
      this.els.initialState.classList.remove("hide");
      this.els.destinationsState.classList.add("hide");
      return;
    }

    this.els.initialState.classList.add("hide");
    this.els.destinationsState.classList.remove("hide");

    this.destinations.forEach((dest) => {
      const card = document.createElement("div");
      card.className = "destination-card";
      card.innerHTML = `
        <div class="dest-icon">
          <svg aria-hidden="true"><use href="#${MODE_ICON[dest.mode]}"/></svg>
        </div>
        <div class="dest-body">
          <div class="dest-address">${this.escapeHtml(dest.address)}</div>
          <div class="dest-duration">${this.escapeHtml(dest.durationText)} from our shop</div>
        </div>
        <button type="button" class="dest-edit" aria-label="Edit this destination">
          <svg aria-hidden="true"><use href="#commutes-edit-icon"/></svg>
        </button>
      `;
      card.querySelector(".dest-edit").addEventListener("click", () => this.openModal(dest));
      this.els.destinationList.appendChild(card);
    });

    window.setTimeout(() => this.updateScrollControls(), 50);
  }

  escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  scrollDestinations(direction) {
    this.els.destinationList.scrollBy({
      left: direction * 280,
      behavior: "smooth",
    });
  }

  updateScrollControls() {
    const el = this.els.destinationList;
    const canScrollLeft = el.scrollLeft > 4;
    const canScrollRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 4;
    this.els.leftControl.classList.toggle("hide", !canScrollLeft);
    this.els.rightControl.classList.toggle("hide", !canScrollRight);
  }
}

function initMap() {
  new Commutes(CONFIGURATION);
}

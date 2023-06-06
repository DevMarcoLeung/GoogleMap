<template>
    <div class="container">
        <div class="text-center row">
            <div class="col-6">
                <h2>Search and add a pin</h2>
                <GmapAutocomplete :ref="gmapAutocomplete" @place_changed='setPlace' @keyup.enter="addMarker" />
                <button @click='addMarker' class="ml-2"> Search </button>
                <button @click='getUserLocation' class="ml-2"> Location </button>
            </div>
            <div class="col-6">
                <h2> {{ this.timeZone.timeZoneId }} </h2>
                <h6> {{ this.localTime }}</h6>
            </div>

        </div>
        <br>
        <GmapMap :center='center' :zoom='12' style='width:100%; height: 80vh;'>
            <GmapMarker :key="index" v-for="(m, index) in searchHistory" :position="m.position"
                @click="center = m.position" />
        </GmapMap>
        <div>
            <b-table striped hover :items="searchHistory" :fields="fields" :per-page="perPage" :current-page="currentPage"
                @row-selected="onRowSelected" ref="selectableTable" selectable>
                <template #cell(selected)="{ rowSelected }">
                    <template v-if="rowSelected">
                        <span aria-hidden="true">&check;</span>
                        <span class="sr-only">Selected</span>
                    </template>
                    <template v-else>
                        <span aria-hidden="true">&nbsp;</span>
                        <span class="sr-only">Not selected</span>
                    </template>
                </template>
            </b-table>
            <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage"></b-pagination>
            <b-button variant="danger" v-on:click="removeSelectHistory">Remove</b-button>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { ZonedDate } from "@progress/kendo-date-math/";
import "@progress/kendo-date-math/tz/all";

export default {
    name: 'GoogleMap',
    data() {
        return {
            timeZone: [],
            localTime: "",
            center: { lat: 45.508, lng: -73.587 },
            fields: ['selected', 'location', 'position'],
            currentPlace: null,
            searchHistory: [],
            selected: [],
            gmapAutocomplete: '',
            perPage: 10,
            currentPage: 1,
        }
    },
    mounted() {
        this.geolocate();
    },
    computed: {
        rows() {
            return this.searchHistory.length;
        }
    },
    methods: {
        getTimeZone(lat, lng) {
            axios
                .get(`https://maps.googleapis.com/maps/api/timezone/json?location=${lat}%2C${lng}&timestamp=1331161200&key=AIzaSyAaahHV1kYLC8H2_mcrpj9YPq0iW1iHJ94`)
                .then((response) => {
                    this.timeZone = response.data;
                    //this.localTime = ZonedDate.fromLocalDate(new Date(), this.timeZone.timeZoneId)._localDate
                    this.localTime = ZonedDate.fromLocalDate(new Date(), this.timeZone.timeZoneId)._utcDate;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        removeSelectHistory() {
            for (var i = this.selected.length - 1; i >= 0; i--)
                this.searchHistory.splice(this.selected[i], 1);
        },
        onRowSelected(items) {
            this.selected = items
        },
        getUserLocation() {
            navigator.geolocation.getCurrentPosition(
                position => {
                    this.addMarkerWithLatLng(position.coords.latitude, position.coords.longitude);
                },
                error => {
                    console.log(error.message);
                },
            )
        },
        setPlace(place) {
            this.currentPlace = place;
        },
        addMarker() {
            if (this.currentPlace) {
                const marker = {
                    lat: this.currentPlace.geometry.location.lat(),
                    lng: this.currentPlace.geometry.location.lng(),
                };
                this.searchHistory.push({
                    location: this.currentPlace.name,
                    position: marker,
                })
                this.center = marker;
                this.currentPlace = null;
                this.getTimeZone(marker.lat, marker.lng)
            }
        },
        addMarkerWithLatLng(lat, lng) {
            const marker = {
                lat: lat,
                lng: lng,
            };
            this.searchHistory.push({
                position: marker,
                location: "Your Location",
                lat: marker.lat,
                lng: marker.lng,
            })
            this.center = marker;
        },
        geolocate: function () {
            navigator.geolocation.getCurrentPosition(position => {
                this.center = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
            });
        },
    },
}
</script>
import { Component, AfterViewInit, Input, ChangeDetectorRef } from '@angular/core';
import { UploadDialog } from '../upload-dialog/upload-dialog';
declare var ymaps: any;

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.html',
  styleUrls: ['./map.css']
})

export class Map implements AfterViewInit {
  constructor(private cdr: ChangeDetectorRef) { }

  @Input() toggleFullScreen?: Function;
  @Input() closeMap?: Function;
  @Input() className?: string;
  wideButton: any;
  userCoords: any[] = [41.311081, 69.240562];
  isWideMap: boolean = false;
  private map: any;

  async ngAfterViewInit() {
    if (typeof window !== 'undefined') {
      await this.loadYandexScript();  // script yuklanishini kutamiz
      this.initMap();                 // keyin xaritani ochamiz
    }
  }

  wideModal() {
    if (this.toggleFullScreen) {
      this.isWideMap = !this.isWideMap;
      this.cdr.detectChanges();
      this.toggleFullScreen()
      if (this.wideButton) {
        this.wideButton.data.set({
          iconSrc: this.isWideMap ? 'assets/icons/collapse.svg' : 'assets/icons/expand.svg'
        });
      }

      setTimeout(() => {
        if (this.map) {
          this.map.container.fitToViewport();
        }
      }, 200);
    }
  }

  loadYandexScript(): Promise<void> {
    return new Promise((resolve, reject) => {

      // Agar script oldin yuklangan bo‘lsa — qayta yuklamaymiz
      if (document.getElementById('yandex-map-script')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = 'yandex-map-script';
      script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
      script.async = true;

      script.onload = () => resolve();
      script.onerror = () => reject("Yandex script load error");

      document.body.appendChild(script);
    });
  }

  initMap() {
    ymaps.ready(() => {
      this.map = new ymaps.Map('map', {
        center: this.userCoords, // Toshkent markazi
        zoom: 12,
        // controls: ['zoomControl', 'fullscreenControl'] // Standart boshqaruvlar
      });

      // Foydalanuvchi nuqtasiga marker qo'yish (ixtiyoriy)
      const userMarker = new ymaps.Placemark(this.map.getCenter(), {
        hintContent: 'Siz shu yerdasiz!',
        balloonContent: 'Sizning joylashuvingiz'
      }, {
        // preset: 'islands#redCircleDotIconWithCaption'
        // Standart ko'rinishni o'chiramiz va rasmga ruxsat beramiz
        iconLayout: 'default#image',

        // Custom SVG yo'li
        iconImageHref: 'assets/icons/currentLocation.png',

        // Marker o'lchami [eni, bo'yi]
        iconImageSize: [50, 50],

        // Markerni "oyoqchasi" yoki markazi qayerda bo'lishi (nuqta o'rtada bo'lishi uchun yarmi olinadi)
        iconImageOffset: [-25, -25]
      });

      // Markerni xaritaga qo'shamiz
      this.map.geoObjects.add(userMarker);

      // 2. Xarita harakatlanganda markerni markazga bog'laymiz
      this.map.events.add('actiontick', (e: any) => {
        // actiontick — xarita surilayotgan har bir lahzada ishlaydi (smooth effekt)
        const tick = e.get('tick');
        const center = this.map.options.get('projection').fromGlobalPixels(tick.globalPixelCenter, tick.zoom);
        userMarker.geometry.setCoordinates(center);
      });

      // --- 2. KENGAYTIRISH TUGMASI (Wide/Expand) ---
      this.wideButton = new ymaps.control.Button({
        data: {
          // Dastlabki rasm
          iconSrc: this.isWideMap ? 'assets/icons/collapse.svg' : 'assets/icons/expand.svg'
        },
        options: {
          layout: ymaps.templateLayoutFactory.createClass(
            // $[data.iconSrc] orqali setData yordamida kelgan qiymatni o'qiymiz
            `<div id="wide-btn" class="flex items-center justify-center bg-white p-2 rounded-md shadow-md cursor-pointer hover:bg-gray-100">
         <img src="$[data.iconSrc]" width="24" height="24">
       </div>`
          ),
          selectOnClick: false
        }
        // data: { title: 'To‘liq ekran' },
        // options: {
        //   layout: ymaps.templateLayoutFactory.createClass(
        //     `<div id="wide-btn" class="flex items-center justify-center bg-white p-2 rounded-md shadow-md cursor-pointer hover:bg-gray-100">
        //      ${this.isWideMap ? `<img src="assets/icons/expand.svg" width="24" height="24">` : `<img src="assets/icons/collapse.svg" width="24" height="24">`}
        //    </div>`
        //   ),
        //   selectOnClick: false
        // }
      });

      // 3. Xarita to'xtaganda (drag tugaganda) koordinatalarni aniq o'rnatish
      this.map.events.add('actionend', () => {
        console.log('Goooo');
        
        userMarker.geometry.setCoordinates(this.map.getCenter());

        // Yangi koordinatalarni olish (masalan, API ga yuborish uchun)
        this.userCoords = this.map.getCenter();
        console.log("Yangi manzil:", this.userCoords);
      });

      // Location button
      const locationButton = new ymaps.control.Button({
        data: {
          content: 'Mening joylashuvim', // Tugma matni
          title: 'Hozirgi joylashuvni aniqlash'
        },
        options: {
          // layout: 'islands#breadcrumbControlLayout',
          layout: ymaps.templateLayoutFactory.createClass(
            `<button class="my-location-btn" title="Mening joylashuvim">
              <img src="assets/icons/location.svg" width="40" height="40">
            </button>`
          ),
          maxWidth: [30, 72, 100],
          selectOnClick: false, // Tugma bosilganda "tanlangan" holatiga o'tib qolmasligi uchun
        }
      });

      // Location button
      const nextButton = new ymaps.control.Button({
        data: {
          content: 'Mening joylashuvim', // Tugma matni
          title: 'Hozirgi joylashuvni aniqlash'
        },
        options: {
          // layout: 'islands#breadcrumbControlLayout',
          layout: ymaps.templateLayoutFactory.createClass(
            `<button id="wide-modal-btn" class="my-location-btn bg-blue-600 py-5 px-8 z-50 rounded-2xl text-white" title="Mening joylashuvim">
              Davom etish
            </button>`
          ),
          // maxWidth: [30, 72, 100],
          selectOnClick: false, // Tugma bosilganda "tanlangan" holatiga o'tib qolmasligi uchun
        }
      });

      // 2. Tugma xaritaga qo'shilgandan keyin unga click event bog'laymiz
      nextButton.events.add('parentchange', (e: any) => {
        if (e.get('newParent')) {
          console.log("1");

          // Bir oz kutamiz DOM-ga rasm chizilishi uchun
          setTimeout(() => {
            const btn = document.getElementById('wide-modal-btn');
            if (btn) {
              btn.addEventListener('click', () => {
                if (this.closeMap) {
                  this.isWideMap = false;
                  console.log(this.userCoords);
                  
                  this.closeMap(this.userCoords);
                }
              });
            }
          }, 0);
        }
      });

      // Tugma bosilgandagi hodisa
      locationButton.events.add('click', () => {
        if (navigator.geolocation) {

          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              this.userCoords = [latitude, longitude];

              // Xaritani foydalanuvchi nuqtasiga surish
              this.map.setCenter(this.userCoords, 15, {
                checkZoomRange: true,
                duration: 500 // Silliq o'tish (ms)
              });

              this.map.geoObjects.add(userMarker);
            },
            (error) => {
              console.error("Geolokatsiya aniqlanmadi:", error);
              alert("Joylashuvingizni aniqlashga ruxsat bermadingiz.");
            }
          );
        } else {
          alert("Brauzeringiz geolokatsiyani qo'llab-quvvatlamaydi.");
        }
      });

      // --- EVENTLARNI BOG'LASH ---
      // const bindEvents = (button: any, elementId: string, callback: Function) => {
      //   button.events.add('parentchange', (e: any) => {
      //     if (e.get('newParent')) {
      //       setTimeout(() => {
      //         const el = document.getElementById(elementId);
      //         if (el) el.onclick = () => callback();
      //       }, 0);
      //     }
      //   });
      // };

      // bindEvents(this.wideButton, 'wide-btn', () => this.wideModal());
      this.wideButton.events.remove('click', () => {});
      this.wideButton.events.add('click', () => this.wideModal());

      // Tugmani xaritaga qo'shish
      this.map.controls.add(locationButton, {
        float: 'none',
        position: {
          bottom: '130px', // Pastdan masofa (pixelda)
          right: '10px'   // O'ngdan masofa
        }
      });
      this.map.controls.add(nextButton, {
        float: 'none',
        position: {
          bottom: '10px', // Pastdan masofa (pixelda)
          right: '10px'   // O'ngdan masofa
        }
      });

      this.map.controls.add(this.wideButton, {
        float: 'none',
        position: {
          bottom: '80px', // Pastdan masofa (pixelda)
          right: '10px'   // O'ngdan masofa
        }
      });
    });
  }
}

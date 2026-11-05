import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/global.css';
import {
  RiFileShield2Line,
  RiFileList3Line,
  RiPriceTag3Line,
  RiSettings4Line,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiAddLine,
  RiCloseLine,
  RiCheckLine,
  RiSunLine,
  RiMoonLine,
  RiHome4Line,
  RiFile2Line,
  RiFile3Line,
  RiFileExcel2Line,
  RiDownload2Line,
  RiShareLine,
  RiRefreshLine,
  RiEyeLine,
  RiInformationLine,
  RiPaletteLine,
  RiFileCopyLine,
  RiLinkM,
  RiCalendarLine,
  RiEditLine,
  RiDeleteBinLine,
  RiFileListLine,
  RiCheckboxCircleLine,
  RiTimeLine,
  RiSearchLine,
  RiArrowUpSLine,
  RiArrowDownSLine,
  RiSparkling2Line,
  RiFileTextLine,
  RiFolder3Line,
  RiBookletLine,
  RiLock2Line,
  RiLoaderLine,
  RiErrorWarningLine,
} from '@remixicon/vue';

const app = createApp(App);
app.use(createPinia());
app.use(router);

// 全局注册 RemixIcon 组件
const icons = {
  RiFileShield2Line,
  RiFileList3Line,
  RiPriceTag3Line,
  RiSettings4Line,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiAddLine,
  RiCloseLine,
  RiCheckLine,
  RiSunLine,
  RiMoonLine,
  RiHome4Line,
  RiFile2Line,
  RiFile3Line,
  RiFileExcel2Line,
  RiDownload2Line,
  RiShareLine,
  RiRefreshLine,
  RiEyeLine,
  RiInformationLine,
  RiPaletteLine,
  RiFileCopyLine,
  RiLinkM,
  RiCalendarLine,
  RiEditLine,
  RiDeleteBinLine,
  RiFileListLine,
  RiCheckboxCircleLine,
  RiTimeLine,
  RiSearchLine,
  RiArrowUpSLine,
  RiArrowDownSLine,
  RiSparkling2Line,
  RiFileTextLine,
  RiFolder3Line,
  RiBookletLine,
  RiLock2Line,
  RiLoaderLine,
  RiErrorWarningLine,
};
for (const [name, comp] of Object.entries(icons)) {
  app.component(name, comp);
}

app.mount('#app');

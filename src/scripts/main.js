import { initContact } from './contact.js';
import { initNavigation } from './navigation.js';
import { initServices } from './services.js';
import { initValues } from './values.js';
import { initMotion } from './motion.js';

// Forms and navigation are initialized before decorative motion.
initContact();
initNavigation();
initServices();
initValues();
initMotion();

// Import jQuery and jQuery plugins
import $ from 'jquery';
import 'jquery.easing';

// Make jQuery available globally
(window as any).$ = $;
(window as any).jQuery = $;

// Import modules
import './dark-mode';
import './freelancer';
import { runBackupCleanup } from './cleanup-backups';
import './contact_me';
import './contact_me_static';
import './analytics-enhanced';
import './video-player';
import './image-optimizer';
import './image-swap';
import './image-update';
import './classie';
import './cbpAnimatedHeader';
// Bootstrap and jqBootstrapValidation will be loaded from CDN

// Run the backup cleanup
runBackupCleanup();

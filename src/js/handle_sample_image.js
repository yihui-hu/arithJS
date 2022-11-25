import { do_actual_reading } from '../js/read_original_image';
import { toroinoue } from '../samples/toroinoue';
import { maplestory } from '../samples/maplestory';
import { colorbars } from '../samples/colorbars';

function handle_toroinoue() {
    do_actual_reading(toroinoue);
}

function handle_maplestory() {
    do_actual_reading(maplestory);
}

function handle_colorbars() {
    do_actual_reading(colorbars);
}

export { handle_toroinoue, handle_maplestory, handle_colorbars }
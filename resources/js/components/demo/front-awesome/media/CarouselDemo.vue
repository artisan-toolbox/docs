<script setup>
import { Carousel, CarouselItem } from '@artisan-toolbox/front-awesome/components/WebAwesome';
</script>

<template>
    <div class="flex min-w-0 flex-col gap-4" data-docs-outline-exclude>
        <div class="min-w-0">
            <Carousel
                :navigation="true"
                :pagination="true"
                :autoplay="false"
                aria-label="Package highlights">
                <CarouselItem>
                    <div class="flex h-40 items-center justify-center bg-brand-100 text-brand-950">
                        Core utilities
                    </div>
                </CarouselItem>
                <CarouselItem>
                    <div class="flex h-40 items-center justify-center bg-brand-900 text-white">
                        Front Awesome UI
                    </div>
                </CarouselItem>
            </Carousel>
        </div>
    </div>
</template>

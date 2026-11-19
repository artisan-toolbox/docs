<script setup>
import { ref } from 'vue';
import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';
import DemoFrame from '@/components/demo/DemoFrame.vue';
import PreviewAvailability from './PreviewAvailability.vue';
import ComparisonSession from './ComparisonSession.vue';
import client from './ComparisonSession.vue?raw';
import literalSource from '../../../../../../app/DataSources/Dapter/LiteralStrictFluent.php?raw';
import literalRecords from '../../../../../../app/Demo/Dapter/Literal/Records.php?raw';
import declaration from '../../../../../../app/Demo/Dapter/Literal/Declaration.php?raw';
import rows from '../../../../../../app/Demo/Dapter/Literal/records.json?raw';
import localeSource from '../../../../../../app/DataSources/Dapter/ComparisonsLocaleFluent.php?raw';
import localeRecords from '../../../../../../app/Demo/Dapter/Comparisons/Records.php?raw';
const props = defineProps({ mode: { type: String, required: true } });
const literal = props.mode === 'literal';
const source = literal ? 'Dapter.LiteralStrictFluent' : 'Dapter.ComparisonsLocaleFluent';
const running = ref(false);
const sources = [
    { label: 'ComparisonSession.vue', language: 'vue', code: client },
    ...(literal
        ? [
              { label: 'LiteralStrictFluent.php', language: 'php', code: literalSource },
              { label: 'Declaration.php', language: 'php', code: declaration },
              { label: 'Records.php', language: 'php', code: literalRecords },
              { label: 'records.json', language: 'json', code: rows },
          ]
        : [
              { label: 'ComparisonsLocaleFluent.php', language: 'php', code: localeSource },
              { label: 'Records.php', language: 'php', code: localeRecords },
          ]),
];
</script>
<template>
    <DemoFrame
        :title="literal ? 'Match exact spelling' : 'Order with Portuguese collation'"
        :description="
            literal
                ? 'Search the name field for joao and inspect the accepted IDs.'
                : 'Choose Locale ascending for the name field and inspect the returned order.'
        "
        :sources="sources"
        :data-comparison="mode"
        data-search-exclude>
        <PreviewAvailability
            ><div class="flex min-w-0 flex-col gap-4">
                <div>
                    <Button @click="running = !running">{{
                        running ? 'Stop example' : 'Start example'
                    }}</Button>
                </div>
                <ComparisonSession v-if="running" :source="source" />
                <p v-else role="status">Start to read the fictional comparison records.</p>
            </div></PreviewAvailability
        >
    </DemoFrame>
</template>

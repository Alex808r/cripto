<template>
  <section>
    <div class="flex">
      <div class="max-w-xs">
        <label for="wallet" class="block text-sm font-medium text-gray-700">
          Тикер
        </label>
        <div class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap">
          <span
            v-for="ticker in exampleTickers"
            :key="ticker.id"
            class="
              inline-flex
              items-center
              px-2
              m-1
              rounded-md
              text-xs
              font-medium
              bg-gray-300
              text-gray-800
              cursor-pointer
            "
            @:click="setTicker(ticker.name)"
            @input="checkTicker(ticker.name)"
          >
            {{ ticker.name }}
          </span>
        </div>

        <div class="mt-1 relative rounded-md shadow-md">
          <input
            v-model="ticker"
            @:click="setTicker(ticker)"
            @input="checkTicker(ticker)"
          
            @keydown.enter="add"
            id="wallet"
            type="text"
            name="wallet"
            class="
              block
              w-full
              pr-10
              border-gray-300
              text-gray-900
              focus:outline-none focus:ring-gray-500 focus:border-gray-500
              sm:text-sm
              rounded-md
            "
            placeholder="Например DOGE"
          />
        </div>

        <div class="">
          <div
            class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap"
            v-if="ticker !== ''"
          >
            <span
              v-for="item in apiTickers.splice(0, 4)"
              :key="item.id"
              @click="(ticker = item.Symbol), add()"
              class="
                inline-flex
                items-center
                px-2
                m-1
                rounded-md
                text-xs
                font-medium
                bg-gray-300
                text-gray-800
                cursor-pointer
              "
            >
              {{ item.Symbol }}
            </span>
          </div>
        </div>
        <div
          v-if="present"
          class="text-sm text-red-600"
        >
          Такой тикер уже добавлен {{ this.ticker }}
        </div>

         <div
          v-if="fakeTicker"
          class="text-sm text-red-600"
        >
          Такого тикера не существует {{ this.ticker }}
        </div>

      </div>
    </div>
    <add-button @click="add" type="button" class="my-4" :disabled="disabled">
    </add-button>
  </section>
</template>

<script>
import AddButton from "./AddButton.vue";

export default {
  name: "AddTicker",

  components: {
    AddButton,
  },

  props: {
    disabled: {
      type: Boolean, // тип объекта
      required: false, // обазательный или нет
      default: false, // значение по умолчанию
    },

    present: {
      type: Boolean,
      required: false,
    },

    fakeTicker: {
      type: Boolean,
      required: false,
    },

    apiTickers: {
      type: Object,
      required: false,
    }
  },

  emits: {
    "add-ticker": (value) => typeof value === "string" && value.length > 0,
    "check-ticker": (value) => typeof value === "string",
  },

  data() {
    return {
      ticker: "",
      exampleTickers: [
        { name: "BTC", id: 1 },
        { name: "DOGE", id: 2 },
        { name: "BCH", id: 3 },
        { name: "CHD", id: 4 },
      ],
    };
  },

  methods: {
    add() {
      if (this.ticker.length === 0) {
        return;
      }
      this.$emit("add-ticker", this.ticker);
      this.ticker = "";
    },

    checkTicker() {
      this.$emit("check-ticker", this.ticker);
    },

    setTicker(ticker) {
      this.ticker = ticker;
    },
  },
};
</script>

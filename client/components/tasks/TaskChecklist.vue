<template>
  <div v-show="showList(task.checklist)" class="task-checklist">
    <div class="progress">
      <v-progress-linear :value="completion" />
    </div>
    <div
      v-for="item in task.checklist"
      :key="item._id"
      class="item"
      @mouseover="showButtons = item._id"
      @mouseleave="showButtons = null"
    >
      <div class="parent">
        <div class="check">
          <div class="pretty p-default">
            <input
              :id="item._id"
              v-model="item.checked"
              type="checkbox"
              @change="toggleCheckItem(item)"
              @click.stop=""
            >
            <div class="state p-primary">
              <label :for="item._id" v-html="linkifyHtml(item.name)" />
            </div>
          </div>
        </div>
        <div v-show="showButtons === item._id" class="right">
          <v-icon
            small
            @click="
              (event) => {
                event.stopPropagation();
                selectedItem = item;
                onConvert();
              }
            "
          >
            mdi-format-list-bulleted
          </v-icon>
          <v-icon
            small
            @click="
              (event) => {
                event.stopPropagation();
                selectedItem = item;
                onDelete();
              }
            "
          >
            mdi-delete
          </v-icon>
        </div>
        <div class="clear" />
      </div>
    </div>
  </div>
</template>

<script>
import TextRenderingMixin from "/imports/ui/mixins/TextRenderingMixin.js";

export default {
  name: "TaskChecklist",
  mixins: [TextRenderingMixin],
  i18n: {
    messages: {
      en: {
        "Convert element to task?": "Convert element to task?",
        "Delete element?": "Delete element?",
        Convert: "Convert"
      },
      fr: {
        "Convert element to task?": "Transformer en tâche ?",
        "Delete element?": "Supprimer l'élément ?",
        Convert: "Convertir"
      }
    }
  },
  props: {
    hideIfEmpty: {
      type: Boolean,
      value: false
    },
    task: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      editNewItem: false,
      selectedItem: {},
      showButtons: null,
      completion: 75
    };
  },
  watch: {
    task: {
      immediate: true,
      handler(task) {
        if (!task.checklist) {
          this.completion = 0;
          return;
        }
        const totalItems = task.checklist.length;
        let completedItems = 0;
        task.checklist.forEach((item) => {
          if (item.checked) {
            completedItems += 1;
          }
        });
        this.completion = 100 * (completedItems / totalItems);
      }
    }
  },
  methods: {
    showList(checklist) {
      if (this.hideIfEmpty && !this.hasItems(checklist)) {
        return false;
      }
      return true;
    },

    hasItems(checklist) {
      return checklist && checklist.length > 0;
    },

    deleteItem(e, item) {
      if (e) {
        e.stopPropagation();
      }
      Meteor.call("tasks.removeChecklistItem", this.task._id, item._id);
    },

    toggleCheckItem(item) {
      Meteor.call(
        "tasks.toggleCheckItem",
        this.task._id,
        item._id,
        item.checked
      );
    },

    onConvert() {
      this.$confirm(this.$t("Convert element to task?"), {
        title: this.$t("Confirm"),
        cancelText: this.$t("Cancel"),
        confirmText: this.$t("Convert")
      }).then((res) => {
        if (res) {
          Meteor.call(
            "tasks.convertItemToTask",
            this.task._id,
            this.selectedItem._id
          );
        }
      });
    },

    onDelete() {
      this.$confirm(this.$t("Delete element?"), {
        title: this.$t("Confirm"),
        cancelText: this.$t("Cancel"),
        confirmText: this.$t("Delete")
      }).then((res) => {
        if (res) {
          Meteor.call(
            "tasks.removeChecklistItem",
            this.task._id,
            this.selectedItem._id
          );
        }
      });
    }
  }
};
</script>

<style scoped>
.task-checklist {
  margin-bottom: 12px;
  position: relative;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.item {
  min-width: 250px;
}

.progress {
  padding-right: 12px;
}

.check {
  float: left;
  white-space: nowrap;
  overflow: hidden;
  box-sizing: border-box;
  text-overflow: ellipsis;
  margin-top: 0;
  font-size: 12px;
  margin-top: 12px;
}

.parent {
  position: relative;
}

.right {
  position: absolute;
  right: 8px;
  top: 12px;
  white-space: nowrap;
  overflow: hidden;
  box-sizing: border-box;
}

.clear {
  clear: both;
}

pre {
  font-family: Inter, Noto Sans, -apple-system, BlinkMacSystemFont, sans-serif;
  white-space: pre-wrap;
}

.empty-state {
  transition: none;
}

.note {
  margin: 8px;
}

.metadata {
  display: flex;
  flex-direction: row;
}

.metadata .author-line {
  display: inline-block;
  flex: 1;
}
.metadata .action {
  display: inline-block;
}

.metadata .action .v-btn {
  margin-top: -10px;
  padding-top: 0;
}

.center {
  text-align: center;
}

.add-item {
  margin-left: -2px;
}

.add-item label {
  font-size: 13px;
}
.pretty .state label:before {
  background-color: white;
}
.pretty {
  white-space: normal !important;
  margin-right: 48px;
}

.pretty .state label {
  text-indent: 0;
  padding-left: 2rem;
  cursor: pointer;
}

.pretty .state label:after,
.pretty .state label:before {
  top: 0;
}

.pretty input {
  width: 20px;
}
</style>

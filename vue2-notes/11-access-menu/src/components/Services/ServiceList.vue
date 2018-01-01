<template>
	<div id="list-demo" class="demo">
		<button v-on:click="add">Add</button>
		<button v-on:click="remove">Remove</button>
		<transition-group name="list" tag="div">
			<p v-for="item in items" v-bind:key="item" class="list-item">
                Service组件{{ item }}
            </p>
		</transition-group>
	</div>
</template>


<script>
    export default {
        name: 'Sevices',
        data() {
            return {
                items: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                nextNum: 10
            }
        },
        methods: {
            // 生成items数组的随机索引
            randomIndex: function() {
                return Math.floor(Math.random() * this.items.length)
            },
            // 随机添加一项
            add: function() {
                this.items.splice(this.randomIndex(), 0, this.nextNum++)
            },
            // 随机移除一项
            remove: function() {
                this.items.splice(this.randomIndex(), 1)
            },
        }
    }
</script>

<style>
    .list-item {
        margin-bottom: 10px;
    }
    
    .list-enter-active,
    .list-leave-active {
        transition: all 1s;
    }
    
    .list-enter,
    .list-leave-active {
        opacity: 0;
        transform: translateX(100px);
    }
</style>
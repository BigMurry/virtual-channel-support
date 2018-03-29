const { getWeb3 } = require('../web3')
const { getModels } = require('../models')

module.exports = async (contractAddress, abi) => {

	const contract = web3.eth.contract(abi).at(contractAddress);
	const channelOpen = contract.ChannelOpen();
	const channelJoin = contract.ChannelJoin();
	const channelChallenge = contract.ChannelChallenge();
	const channelClose = contract.ChannelClose();
	const { User, Transaction, Channel } = getModels();

	channelOpen.watch(function(error, result){
	    console.log('channel opened')
	    if(!error) {
	    	let response = result.args
	    	//check if channel exists
	    	let channel = await Channel.findOne({
	    		where: {channelID: response.channelID}
	    	})
	    	if(!channel) {
	    		//check if user exists
	    		let user1 = await User.findOne({where: {address: response.address1}})
	    		//if not, add new user
		    	if(!user1) {
		    		user1 = await User.build({
		    			address: response.address1,
		    			channelIDs: [response.channelID]
		    		}).save()
		    	}
		    	//check if user exists
	    		let user2 = await User.findOne({where: {address: response.address2}})
	    		//if not, add new user
		    	if(!user2) {
		    		user2 = await User.build({
		    			address: response.address2,
		    			channelIDs: [response.channelID]
		    		}).save()
		    	}
		    	//create new channel DB entry
		    	channel = await Channel.build({
		    		channelID: response.channelID,
		    		stake1: response.stake1,
		    		stake2: 0,
		    		address1: response.address1,
		    		address2: response.address2,
		    		status: 'open',
		    		latestNonce: 0
		    	}).save()    	
	    	}
	    }
	});

	channelJoin.watch(function(error, result){
		console.log('channel joined')
		if(!error) {
			let response = result.args
			//check if channel exists
			let channel = await Channel.findOne({
				where: {channelID: response.channelID}
			})
			if(channel) {
				channel.stake2 = response.stake2
				await channel.save()
			}
		}
	})

	channelChallenge.watch(function(error, result){
		console.log('channel in challenge period')
		if(!error) {
			let response = result.args
			//check it channel exists
			let channel = await Channel.findOne({
				where: {channelID : response.channelID}
			})
			if(channel) {
				channel.status = 'challenge'
				await channel.save()
				//TODO attempt to tell user through phone
			}
		}
	})

	channelClose.watch(function(error, result){
		console.log('channel closed')
		if(!error) {
			let response = result.args
			//check it channel exists
			let channel = await Channel.findOne({
				where: {channelID : response.channelID}
			})
			if(channel) {
				channel.status = 'close'
				await channel.save()
				//TODO attempt to tell user through phone
			}
		}
	})	

}


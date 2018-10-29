import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import PlayerPreview from './PlayerPreview';
import queryString from 'query-string';
import { battle } from '../utiles/api';
import Loading from './Loading';

function Profile({info}){    
    return(    
        <PlayerPreview
            avatar={info.avatar_url}
            username={info.login}
        >
            {info.name && <li>{info.name}</li>}
            {info.location && <li>{info.location}</li>}
            {info.company && <li>{info.company}</li>}
            <li>Followers: {info.followers}</li>
            <li>Following: {info.following}</li>
            <li>Public Repos: {info.public_repos}</li>
            {info.blog && <li><a href={info.blog}>{info.blog}</a></li>}
        </PlayerPreview>
    );
}

Profile.propTypes = {
    info: PropTypes.object.isRequired,
  }

function Player ({label, score, profile}){
    return(
        <div>
            <h1 className='header'>{label}</h1>
            <h3 style={{textAlign:'center'}}>Score: {score}</h3>            
            <Profile info={profile}/>            
        </div>
    );
}

Player.protoTypes = {
    label: PropTypes.string.isRequired, 
    score: PropTypes.number.isRequired, 
    profile: PropTypes.object.isRequired, 
}

class Results extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            winner: null,
            loser: null,
            error: null,
            loading: true,
        };
    }
    async componentDidMount(){
        var {playerOneName, playerTwoName} = queryString.parse(this.props.location.search);

        const playersAfterBattle = await battle([playerOneName, playerTwoName]);
        
        if(playersAfterBattle === null){
            return this.setState(() => ({
                    error: 'Something goes wrong.',
                    loading: false,
            }));
        }

        this.setState(() => ({
                error:null,
                winner: playersAfterBattle[0],
                loser:playersAfterBattle[1],
                loading: false
        }));
        
    }

    render(){    
        const {error, winner, loser, loading} = this.state;        

        if(loading === true){
            return(
                <Loading/>
            );
        }

        if(error){
            return(
                <div>
                    <p>{error}</p>
                    <Link to='/battle'>Reset</Link>
                </div>
            )
        }

        return(
            <div className='row'>
                <Player
                    label='Winner'
                    score={winner.score}
                    profile={winner.profile}
                />
                <Player
                    label='Loser'
                    score={loser.score}
                    profile={loser.profile}
                />
            </div>
        );
    }
}

export default Results;
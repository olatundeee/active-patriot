import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import { Role } from 'app/utils/Community';
import SettingsEditButton from 'app/components/elements/SettingsEditButton';
import SubscribeButton from 'app/components/elements/SubscribeButton';
import Icon from 'app/components/elements/Icon';
import * as globalActions from 'app/redux/GlobalReducer';
import { numberWithCommas } from 'app/utils/StateFunctions';
import tt from 'counterpart';

const nl2br = text =>
    text.split('\n').map((item, key) => (
        <span key={key}>
            {item}
            <br />
        </span>
    ));
const nl2li = text =>
    text.split('\n').map((item, key) => <li key={key}>{item}</li>);

    const links = [
        {
            label: tt('navigation.active_patriot_youtube'),
            link: 'https://www.youtube.com/channel/UCwfIIN1nRLzA-uxqasvRWRQ',
        },
        {
            label: tt('navigation.active_scooter_chase'),
            link: 'https://www.youtube.com/watch?v=eirAX1I488U',
        },
        {
            label: tt('navigation.dover_docks_arrest'),
            link: 'https://www.youtube.com/watch?v=yLeG518OSuM',
        },
        /* {
            label: tt('navigation.steem_engine'),
            link: 'https://steemengine.com/',
        },*/
    ]
    
    const makeLink = (i, ix, arr) => {
        // A link is internal if it begins with a slash
        const isExternal = !i.link.match(/^\//) || i.isExternal;
        const cn = ix === arr.length - 1 ? 'last' : null;
        if (isExternal) {
            return (
                <li key={ix} className={cn}>
                    <a href={i.link} target="_blank" rel="noopener noreferrer">
                        {i.label}&nbsp;<Icon name="extlink" />
                    </a>
                </li>
            );
        }
        if (i.onClick) {
            return (
                <li key={ix} className={cn}>
                    <a onClick={i.onClick}>{i.label}</a>
                </li>
            );
        }
        return (
            <li key={ix} className={cn}>
                <Link to={i.link}>{i.label}</Link>
            </li>
        );
    };

class CommunityPane extends Component {
    static propTypes = {
        community: PropTypes.object.isRequired,
        showRecentSubscribers: PropTypes.func.isRequired,
        showModerationLog: PropTypes.func.isRequired,
    };

    render() {
        const {
            community,
            showRecentSubscribers,
            showModerationLog,
        } = this.props;
        const handleSubscriberClick = () => {
            showRecentSubscribers(community);
        };

        const handleModerationLogCLick = e => {
            e.preventDefault();
            showModerationLog(community);
        };

        function teamMembers(members) {
            return members.map((row, idx) => {
                const account = `@${row.get(0)}`;
                const title = row.get(2);
                const role = row.get(1);
                if (role === 'owner') {
                    return null;
                }
                return (
                    <div
                        key={`${account}__${role}`}
                        style={{ fontSize: '80%' }}
                    >
                        <Link to={`/${account}`}>{account}</Link>
                        {role && <span className="user_role"> {role} </span>}
                        {title && <span className="affiliation">{title}</span>}
                    </div>
                );
            });
        }

        const category = community.get('name');
        const viewer_role = community.getIn(['context', 'role'], 'guest');
        const canPost = Role.canPost(category, viewer_role);

        return (
            <div>
                <div className="c-sidebar__module">
                    {Role.atLeast(viewer_role, 'admin') && (
                        <div style={{ float: 'right', fontSize: '0.8em' }}>
                            <SettingsEditButton
                                community={community.get('name')}
                            >
                                Edit
                            </SettingsEditButton>
                        </div>
                    )}
                    <div className="c-sidebar__header">
                        <h3 className="c-sidebar__h3">
                            {community.get('title')}
                        </h3>
                        {community.get('is_nsfw') && (
                            <span className="affiliation">nsfw</span>
                        )}
                    </div>
                    <div style={{ margin: '-6px 0 12px' }}>
                        {community.get('about')}
                    </div>
                    <div
                        className="row"
                        style={{ textAlign: 'center', lineHeight: '1em' }}
                    >
                        <div
                            onClick={handleSubscriberClick}
                            className="column small-4 pointer"
                        >
                            {numberWithCommas(community.get('subscribers'))}
                            <br />
                            <small>
                                {community.get('subscribers') == 1
                                    ? 'subscriber'
                                    : 'subscribers'}
                            </small>
                        </div>
                        <div className="column small-4">
                            {'$'}
                            {numberWithCommas(community.get('sum_pending'))}
                            <br />
                            <small>
                                pending<br />rewards
                            </small>
                        </div>
                        <div className="column small-4">
                            {numberWithCommas(community.get('num_authors'))}
                            <br />
                            <small>
                                active<br />posters
                            </small>
                        </div>
                    </div>

                    <div style={{ margin: '12px 0 0' }}>
                        {community && (
                            <SubscribeButton
                                community={community.get('name')}
                                display="block"
                            />
                        )}
                        {canPost && (
                            <Link
                                className="button primary"
                                style={{
                                    minWidth: '6em',
                                    display: 'block',
                                    margin: '-6px 0 8px',
                                }}
                                to={`/submit.html?category=${category}`}
                            >
                                New Post
                            </Link>
                        )}
                        {!canPost && (
                            <div
                                className="text-center"
                                style={{ marginBottom: '8px' }}
                            >
                                <small className="text-muted">
                                    <Icon name="eye" />&nbsp; Only approved
                                    members can post
                                </small>
                            </div>
                        )}
                    </div>
                    <div>
                        {Role.atLeast(viewer_role, 'mod') && (
                            <div style={{ float: 'right', fontSize: '0.8em' }}>
                                <Link to={`/roles/${category}`}>
                                    Edit Roles
                                </Link>
                            </div>
                        )}
                        <strong>Leadership</strong>
                        {teamMembers(community.get('team', List()))}
                        <div style={{ float: 'right', fontSize: '0.8em' }}>
                            <a onClick={handleModerationLogCLick}>
                                Activity Log
                            </a>
                        </div>
                    </div>
                </div>
                <div className="c-sidebar__module">
                    {community.get('description') && (
                        <div>
                            <strong>Description</strong>
                            <br />
                            {nl2br(community.get('description', 'empty'))}
                            <br />
                        </div>
                    )}
                    {community.get('flag_text') && (
                        <div>
                            <strong>Rules</strong>
                            <br />
                            <ol>{nl2li(community.get('flag_text'))}</ol>
                            <br />
                        </div>
                    )}
                    
                    <div>                        
                        <ul>
                            {links.map(makeLink)}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    // mapStateToProps
    (state, ownProps) => ({
        community: ownProps.community,
    }),
    // mapDispatchToProps
    dispatch => {
        return {
            showRecentSubscribers: community => {
                dispatch(
                    globalActions.showDialog({
                        name: 'communitySubscribers',
                        params: { community },
                    })
                );
            },
            showModerationLog: community => {
                dispatch(
                    globalActions.showDialog({
                        name: 'communityModerationLog',
                        params: { community },
                    })
                );
            },
        };
    }
)(CommunityPane);

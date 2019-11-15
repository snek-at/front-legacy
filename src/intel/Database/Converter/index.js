import * as select from "../Statements/Select"
import { objectTypeSpreadProperty } from "@babel/types";

// Formats a date to YYYY-MM-DD format
const formatDate = (date) => {return date.toISOString().split('T')[0] };


export function getUser(data) {
  let platforms = data.exec(select.platform);

  // Use information of platform 0 as basic information
  let platform = platforms[0];
  let user = {};
  user.avatarUrl = platform.avatarUrl;
  user.company = platform.company;
  user.createdAt = platform.createdAt;
  user.name = platform.fullName;
  user.username = platform.username;
  user.email = platform.email;
  user.websiteUrl = platform.websiteUrl;
  user.status = platform.status;
  user.statusEmojiHTML = platform.statusEmojiHTML;
  user.isEmployee = false;
  user.isHireable = false;
  user.location = platform.location;

  return user
}

export function getOrganizations(data) {
  let organizations = data.exec(select.organization)

  let orgs = {}
  organizations.forEach(orgWithMember => {
    if (!orgs[orgWithMember.oId]) {
      let org = {}
      org.name = orgWithMember.oName;
      org.url = orgWithMember.oUrl;
      org.avatarUrl = orgWithMember.oAvatarUrl;
      org.memberCount = 0;
      org.membersWithRole = [];
      orgs[orgWithMember.oId] = org;
    }

    if(orgWithMember.mId !== undefined){
      let member = {};
      member.oid = orgWithMember.oId;
      member.name = orgWithMember.mName
      member.login = orgWithMember.mUsername
      member.avatarUrl = orgWithMember.mAvatarUrl
      member.url = orgWithMember.mUrl
      member.projectsUrl = null;

      orgs[orgWithMember.oId].memberCount++;
      orgs[orgWithMember.oId].membersWithRole.push(member)
    }
  })
  return orgs
}

export function getRepositories(data) {
  let repositories = data.exec(select.repository)

  let repos = {}
  repositories.forEach(repoWithExtras => {
    if (!repos[repoWithExtras.rId]) {
      let repo = {}
      repo.name = repoWithExtras.rName;
      repo.avatarUrl = repoWithExtras.oAvatarUrl;

      repo.owner = {}
      repo.owner.name = repoWithExtras.oName;
      repo.owner.login = repoWithExtras.oUsername;
      repo.owner.url = repoWithExtras.oUrl;

      repo.languagePie = {}
      repo.languagePie.size = repoWithExtras.lSize;
      repo.languagePie.total = repoWithExtras.lTotal;
      repo.languagePie.slices = []

      repos[repoWithExtras.rId] = repo;

    }

    if(repoWithExtras.mId !== undefined){
      let member = {};
      member.oid = repoWithExtras.oId;
      member.name = repoWithExtras.mName
      member.login = repoWithExtras.mUsername
      member.avatarUrl = repoWithExtras.mAvatarUrl
      member.url = repoWithExtras.mUrl
      member.projectsUrl = null;

      repos[repoWithExtras.rId].memberCount++;
      repos[repoWithExtras.rId].membersWithRole.push(member)
    }

    if(repoWithExtras.sId !== undefined){
      let slice = {};
      slice.name = repoWithExtras.sName;
      slice.color = repoWithExtras.sColor;
      slice.size = repoWithExtras.sSize;

      repos[repoWithExtras.rId].languagePie.slices.push(slice)
    }
    
  });


  return repos
}

export function getLanguages(data) {
  let languages = data.exec(select.language)
  let totalSize = data.exec(select.totalLanguageSize)[0].num;
  let slices = {}

  languages.forEach(languageSlice => {
    if (!slices[languageSlice.sName]) {
      let slice = {}
      slice.name = languageSlice.sName;
      slice.color = languageSlice.sColor;
      slice.size = languageSlice.sSize;
      slice.share = Math.round(slice.size / totalSize * 100 * 100) / 100;

      slices[languageSlice.sName] = slice;
    } else {
      slices[languageSlice.sName].size += languageSlice.sSize;
      slices[languageSlice.sName].share = Math.round(slices[languageSlice.sName].size / totalSize * 100 * 100) / 100;
    }

  })
  return slices
}

export function getCalendar(data) {
  let calendar = data.exec(select.calendar)
  let baseYear = data.exec(select.baseYearOfPlatforms)[0].baseYear;

  //let totalContribs = data.exec(select.totalContributions, [])[0].num;



  // Empty calendar


  let calendarGrid = {}




  //console.log(baseYear)
  let date = null;
  for (let indexY = baseYear; indexY <= new Date().getFullYear(); indexY++) {
    let emptyContributionYear = {}
    emptyContributionYear.weeks = {}
    emptyContributionYear.total = 0
    date = new Date(indexY, 0, 1);
    for (let indexW = 0; indexW < 53; indexW++) {
      let week = {}
      week.contributionDays = {}

      for (let indexD = 0; indexD <= 6; indexD++) {
        let day = {}
        date.setDate(date.getDate() + 1);
        day.total = 0
        day.date = formatDate(new Date(date));
        day.color = "#ffffff"
        week.contributionDays[indexD] = day
      }

      emptyContributionYear.weeks[indexW] = week
    }
    calendarGrid[indexY] = emptyContributionYear
  }

  calendar.forEach(day => {
    if(day.cYear){
      calendarGrid[day.cYear].total++;
      calendarGrid[day.cYear].weeks[day.cWeek].contributionDays[day.cWeekday].total++;
      calendarGrid[day.cYear].weeks[day.cWeek].contributionDays[day.cWeekday].color = day.cColor;
    }
  })
  
  return calculateColorsForCalendarDay(calendarGrid)
}

// Fill the raw calendar structure with the correct colors
const calculateColorsForCalendarDay = (rawCalendar) => {
  Object.values(rawCalendar).forEach(_year => {
      let busiestDay = 0;
      // Calculate busiest day of the year
      Object.values(_year.weeks).forEach(_week => {
        Object.values(_week.contributionDays).forEach(_day => {
          if (_day.total > busiestDay) {
            busiestDay = _day.total;
        }
        })
      })

      Object.values(_year.weeks).forEach(_week => {
        Object.values(_week.contributionDays).forEach(_day => {
          let precision = _day.total / busiestDay;
          if (precision > 0.8 && precision <= 1) {
              _day.color = "#196127";
          } else if (precision > 0.6 && precision <= 0.8) {
              _day.color = "#239a3b";
          } else if (precision > 0.4 && precision <= 0.6) {
              _day.color = "#7bc96f";
          } else if (precision > 0.0 && precision <= 0.4) {
              _day.color = "#c6e48b";
          } else if (precision === 0) {
              _day.color = "#ebedf0";
          }
        })
      })
  });
  return rawCalendar;
}
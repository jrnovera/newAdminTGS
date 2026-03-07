# TGS Venue Schema Reference

Complete field reference for all tabs across **Retreat Venue** and **Wellness Venue** types.
Used as the source of truth before generating SQL migration scripts.

---

## Tab Structure Overview

| Tab | Retreat Venue | Wellness Venue |
|-----|:---:|:---:|
| Overview | ✓ | ✓ |
| Accommodation | ✓ | ✓ (different fields) |
| Amenities | ✓ | ✓ |
| Wellness Services | ✓ | ✓ |
| Wellness Facilities | ✓ | ✓ |
| Retreat Facilities | ✓ | ✗ |
| Pricing & Booking | ✓ | ✓ |
| Media | ✓ | ✓ |
| Internal | ✓ | ✓ |
| Owner/Manager | ✓ | ✓ |
| Bookings | ✓ | ✓ |
| Reviews | ✓ | ✓ |

---

## TAB 1 — OVERVIEW

### Retreat Venue (`retreat_venues`)

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| venue_name | text | required |
| primary_venue_type | text | select: Retreat Venue / Wellness Centre / Day Spa / Bathhouse / Resort / Hotel / Eco Lodge / Private Estate |
| retreat_venue_type | text[] | multi-select: Dedicated Retreat Centre, Eco Lodge, Private Estate, Boutique Hotel, Mountain Lodge, Beach Property, Wellness Resort, Monastery/Ashram, Farm/Ranch, Villa, Castle/Historic, Glamping/Tented |
| hire_type | text | select: Exclusive Use / Shared Use / Room Only |
| property_description | text | required |
| short_description | text | |
| hero_quote | text | |
| introduction_text | text | |
| property_size | numeric | |
| property_size_unit | text | select: Acres / Hectares / Square Metres |
| year_established | text | |
| architecture_style | text | select: Contemporary Rural / Traditional / Minimalist / Balinese / Japanese / Mediterranean / Colonial / Eco/Sustainable |
| experience_title | text | |
| experience_subtitle | text | |
| experience_description | text | |
| modalities | text[] | multi-select: Yoga, Meditation, Breathwork, Sound Healing, Nutrition, Wellness, Cooking, Pilates, Mindfulness, Ayurveda, Naturopathy |
| ideal_retreat_types | text[] | multi-select: Yoga Retreats, Meditation Retreats, Wellness Retreats, Corporate Retreats, Nutrition Retreats, Detox Retreats, Silent Retreats, Creative Retreats, Fitness Retreats, Small Group Gatherings |
| street_address | text | required |
| city | text | required |
| postcode | text | required |
| state | text | required; select: NSW / QLD / VIC / SA / WA / TAS / NT / ACT |
| country | text | required; select: Australia / New Zealand / Japan / Indonesia / Thailand / Costa Rica |
| climate | text | select: Temperate / Tropical / Arid / Alpine / Mediterranean |
| location_type | text[] | multi-select: Rural, Countryside, Coastal, Mountainous, Urban Fringe, Tropical, Island, Lakeside |
| gps_coordinates | text | format: "-34.7754, 150.6989" |
| nearest_airport | text | |
| transport_access | text[] | multi-select: Car Recommended, Airport Transfers Available, Public Transport Nearby, Shuttle Service, Helicopter Access |
| listing_status | text | required; select: Active / Draft / Inactive |
| property_status | text | select: Operational / Under Construction / Seasonal |
| subscription_level | text | select: Essentials / Standard / Featured / Premium |
| sanctum_vetted | boolean | |
| featured_listing | boolean | |
| instant_booking | boolean | |
| overview_hero_image | text | image url |
| experience_feature_image | text | image url |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### Wellness Venue (`wellness_venues`)

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| venue_name | text | required |
| primary_venue_type | text | fixed: "Wellness Venue" |
| wellness_venue_type | text[] | multi-select: Day Spa, Bathhouse, Treatment Centre, Urban Sanctuary, Wellness Resort, Hotel Spa, Medical Spa, Thermal Springs |
| wellness_categories | text[] | multi-select: Massage, Facials, Body Treatments, Thermal Circuit, Hydrotherapy, Infrared Sauna, Sound Healing, Meditation, Yoga, Breathwork, Naturopathy, Ayurveda |
| venue_description | text | required |
| short_description | text | |
| hero_quote | text | |
| introduction_text | text | |
| treatment_rooms | integer | |
| couples_suites | integer | |
| total_practitioners | integer | |
| floor_area_sqm | numeric | |
| year_established | text | |
| max_concurrent_clients | integer | |
| experience_title | text | |
| experience_subtitle | text | |
| experience_description | text | |
| signature_treatments | text[] | multi-select (same options as wellness_categories) |
| best_for | text[] | multi-select: Couples, Solo Relaxation, Girls' Day Out, Gift Experiences, Corporate Groups, Prenatal, Bridal Parties, Recovery |
| street_address | text | required |
| suite_level | text | |
| city | text | required |
| postcode | text | required |
| state | text | required; select: NSW / QLD / VIC / SA / WA / TAS / NT / ACT |
| country | text | required; select: Australia / New Zealand / Japan |
| location_type | text[] | multi-select: Urban, City Center, Suburban, Coastal, Rural, Resort |
| gps_coordinates | text | |
| nearest_transport | text | |
| parking_access | text[] | multi-select: Street Parking, Public Transport, Wheelchair Accessible, Valet Parking, Bicycle Parking |
| listing_status | text | required; select: Active / Draft / Inactive |
| business_status | text | select: Operational / Temporarily Closed / Under Renovation / Seasonal |
| subscription_level | text | select: Essentials / Standard / Featured / Premium |
| sanctum_vetted | boolean | |
| featured_listing | boolean | |
| online_booking | boolean | |
| overview_hero_image | text | image url |
| experience_feature_image | text | image url |
| created_at | timestamptz | |
| updated_at | timestamptz | |

---

## TAB 2 — ACCOMMODATION

### Retreat Venue — `retreat_accommodation` (1-to-1 with retreat_venues)

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| venue_id | uuid | FK → retreat_venues.id |
| max_guests | integer | required |
| min_guests | integer | |
| total_bedrooms | integer | required |
| total_bathrooms | integer | required |
| shared_bathrooms | integer | |
| private_ensuites | integer | |
| accommodation_style | text | select: Private Rooms / Shared Rooms / Suites / Mixed |
| property_type | text | select: Whole Property / Individual Rooms / Mixed |
| accommodation_description | text | |
| king_beds | integer | |
| queen_beds | integer | |
| double_beds | integer | |
| single_beds | integer | |
| twin_beds | integer | |
| bunk_beds | integer | |
| sofa_beds | integer | |
| rollaway_beds | integer | |
| checkin_time | text | default: "3:00 PM" |
| checkout_time | text | default: "10:00 AM" |
| early_checkin | boolean | |
| late_checkout | boolean | |
| children_allowed | boolean | |
| min_child_age | integer | |
| pets_allowed | boolean | |
| smoking_allowed | boolean | |

### Retreat Rooms — `retreat_rooms` (1-to-many with retreat_venues)

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| venue_id | uuid | FK → retreat_venues.id |
| room_name | text | |
| room_image | text | image url |
| room_description | text | |
| room_type | text | select: Suite / Standard / Deluxe / Dormitory / Cabin / Villa / Studio |
| king_beds | integer | |
| queen_beds | integer | |
| single_beds | integer | |
| max_occupancy | integer | |
| bathroom_type | text | select: Private Ensuite / Shared / Jack and Jill / None |
| room_amenities | text[] | |
| sort_order | integer | |

### Wellness Venue — `wellness_accommodation` (1-to-1 with wellness_venues)

> Wellness venues don't have sleeping accommodation. This tab covers service/treatment capacity.

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| venue_id | uuid | FK → wellness_venues.id |
| treatment_rooms | integer | |
| couples_suites | integer | |
| total_practitioners | integer | |
| floor_area_sqm | numeric | |
| max_concurrent_clients | integer | |
| price_range_per_session | text | |
| package_pricing_available | boolean | |
| membership_options | boolean | |
| appointment_required | boolean | |
| online_booking_available | boolean | |

---

## TAB 3 — AMENITIES

> Same structure for both Retreat and Wellness venues.
> Table uses `venue_id` + `venue_type` ('retreat' | 'wellness') as composite reference.

### `venue_amenities` (1-to-1)

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| venue_id | uuid | FK (retreat or wellness) |
| venue_type | text | 'retreat' \| 'wellness' |
| amenities_hero_image | text | image url; recommended 1920×600px |
| section_break_image | text | image url; recommended 1920×400px |
| — Kitchen & Dining — | | |
| has_commercial_kitchen | boolean | |
| has_domestic_kitchen | boolean | |
| has_full_fridge | boolean | |
| has_walkin_pantry | boolean | |
| has_dishwasher | boolean | |
| has_oven_stove | boolean | |
| has_microwave | boolean | |
| has_coffee_machine | boolean | |
| has_blender | boolean | |
| has_formal_dining | boolean | |
| has_outdoor_dining | boolean | |
| has_bbq | boolean | |
| has_pizza_oven | boolean | |
| has_breakfast_bar | boolean | |
| has_cookware | boolean | |
| dining_capacity_indoor | integer | |
| dining_capacity_outdoor | integer | |
| — Living & Entertainment — | | |
| has_living_room | boolean | |
| has_fireplace | boolean | |
| has_smart_tv | boolean | |
| has_streaming | boolean | |
| has_sound_system | boolean | |
| has_library | boolean | |
| has_games_room | boolean | |
| has_board_games | boolean | |
| has_piano | boolean | |
| has_projector | boolean | |
| has_home_cinema | boolean | |
| has_gym_equipment | boolean | |
| — Technology & Connectivity — | | |
| has_wifi | boolean | |
| has_high_speed_internet | boolean | |
| has_starlink | boolean | |
| has_mobile_signal | boolean | |
| has_ev_charging | boolean | |
| has_printer | boolean | |
| has_office_space | boolean | |
| wifi_speed_mbps | text | |
| wifi_coverage | text | select: Whole Property / Main Building Only / Common Areas Only |
| — Outdoor & Grounds — | | |
| has_swimming_pool | boolean | |
| has_heated_pool | boolean | |
| has_indoor_pool | boolean | |
| has_garden | boolean | |
| has_outdoor_seating | boolean | |
| has_verandah | boolean | |
| has_fire_pit | boolean | |
| has_tennis_court | boolean | |
| has_golf_access | boolean | |
| has_farm_animals | boolean | |
| has_orchard | boolean | |
| has_walking_trails | boolean | |
| has_beach_access | boolean | |
| has_lake_river_access | boolean | |
| pool_type | text | select: Heated Outdoor / Unheated Outdoor / Indoor / Natural/Dam |
| — Parking & Transport — | | |
| has_free_parking | boolean | |
| has_onsite_parking | boolean | |
| has_covered_parking | boolean | |
| has_bus_coach_access | boolean | |
| has_airport_transfers | boolean | |
| has_helipad | boolean | |
| parking_spaces | integer | |
| distance_to_nearest_town | text | |
| — Laundry & Housekeeping — | | |
| has_washing_machine | boolean | |
| has_dryer | boolean | |
| has_iron | boolean | |
| has_linens | boolean | |
| has_towels | boolean | |
| has_daily_housekeeping | boolean | |
| has_laundry_service | boolean | |
| — Climate & Comfort — | | |
| has_air_conditioning | boolean | |
| has_central_heating | boolean | |
| has_fireplace_heater | boolean | |
| has_ceiling_fans | boolean | |
| has_underfloor_heating | boolean | |
| has_heated_bathroom_floors | boolean | |
| — Safety & Security — | | |
| has_smoke_detectors | boolean | |
| has_co_detector | boolean | |
| has_fire_extinguisher | boolean | |
| has_first_aid | boolean | |
| has_security_system | boolean | |
| has_gated_property | boolean | |
| has_cctv | boolean | |
| has_onsite_security | boolean | |
| — Good to Know — | | |
| wifi_details | text | |
| mobile_coverage_details | text | |
| wheelchair_access_details | text | |
| dietary_capability | text | |
| smoking_policy | text | |
| pets_policy | text | |
| additional_amenity_notes | text | |

---

## TAB 4 — WELLNESS SERVICES

> Same structure for both Retreat and Wellness venues.

### `venue_wellness_services` (1-to-1)

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| venue_id | uuid | FK |
| venue_type | text | 'retreat' \| 'wellness' |
| services_hero_image | text | image url; recommended 1920×600px |
| tab_label | text | default: "Experiences & Add-Ons" |
| tab_title | text | default: "Enhance Your Retreat" |
| tab_subtitle | text | |
| intro_paragraph | text | |
| practitioners_section_label | text | default: "Resident Practitioners" |
| practitioners_section_subtitle | text | |
| onsite_practitioners | boolean | |
| external_practitioners_welcome | boolean | |
| byo_facilitator | boolean | |
| can_arrange_services | boolean | |
| advance_booking_required | text | select: No / Yes-48hrs / Yes-1week / Yes-2weeks |
| service_pricing_model | text | select: Included in hire / Additional cost / Some included |
| — Massage & Bodywork — | | |
| has_swedish_massage | boolean | |
| has_deep_tissue | boolean | |
| has_remedial_massage | boolean | |
| has_aromatherapy_massage | boolean | |
| has_hot_stone | boolean | |
| has_lymphatic_drainage | boolean | |
| has_thai_massage | boolean | |
| has_reflexology | boolean | |
| has_shiatsu | boolean | |
| has_craniosacral | boolean | |
| has_myofascial | boolean | |
| has_pregnancy_massage | boolean | |
| — Movement & Fitness — | | |
| has_yoga | boolean | |
| has_pilates | boolean | |
| has_meditation | boolean | |
| has_breathwork | boolean | |
| has_tai_chi | boolean | |
| has_personal_training | boolean | |
| has_nature_walks | boolean | |
| has_sound_healing | boolean | |
| has_dance_therapy | boolean | |
| — Holistic & Energy — | | |
| has_reiki | boolean | |
| has_energy_healing | boolean | |
| has_acupuncture | boolean | |
| has_acupressure | boolean | |
| has_kinesiology | boolean | |
| has_hypnotherapy | boolean | |
| has_crystal_healing | boolean | |
| has_shamanic_healing | boolean | |
| has_ayurvedic | boolean | |
| — Nutrition & Detox — | | |
| has_nutritional_consultation | boolean | |
| has_cooking_classes | boolean | |
| has_juice_cleanse | boolean | |
| has_detox_programs | boolean | |
| has_plant_based_menu | boolean | |
| has_fasting_programs | boolean | |
| has_iv_therapy | boolean | |
| has_colonic_hydrotherapy | boolean | |
| — Mind & Spirit — | | |
| has_life_coaching | boolean | |
| has_counselling | boolean | |
| has_mindfulness_training | boolean | |
| has_psychotherapy | boolean | |
| has_cacao_ceremony | boolean | |
| has_mens_womens_circles | boolean | |
| has_journaling_workshops | boolean | |
| has_tarot_reading | boolean | |
| has_astrology | boolean | |
| — Beauty & Spa — | | |
| has_facials | boolean | |
| has_body_scrubs | boolean | |
| has_manicure_pedicure | boolean | |
| has_hair_treatments | boolean | |
| has_waxing | boolean | |
| has_makeup_services | boolean | |
| service_notes | text | |

### `venue_practitioners` (1-to-many)

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| venue_id | uuid | FK |
| venue_type | text | 'retreat' \| 'wellness' |
| avatar_url | text | image url |
| practitioner_name | text | |
| practitioner_title | text | |
| services | text[] | |
| website_display_title | text | |
| website_description | text | |
| show_on_website | boolean | |
| sort_order | integer | |

---

## TAB 5 — WELLNESS FACILITIES

> Same structure for both Retreat and Wellness venues.

### `venue_wellness_facilities` (1-to-1)

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| venue_id | uuid | FK |
| venue_type | text | 'retreat' \| 'wellness' |
| facilities_hero_image | text | image url; recommended 1920×600px |
| section_label | text | default: "Water & Healing" |
| section_title | text | |
| section_subtitle | text | |
| intro_paragraph | text | |

### `wellness_facility_items` (1-to-many)

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| venue_id | uuid | FK |
| venue_type | text | 'retreat' \| 'wellness' |
| facility_name | text | |
| facility_image | text | image url; recommended 800×600px |
| show_on_website | boolean | |
| is_available | boolean | |
| website_display_title | text | |
| website_description | text | |
| facility_type | text | select: Sauna / Swimming Pool / Cold Plunge / Hot Plunge/Spa / Treatment Room / Other |
| setting | text | select: Indoor / Outdoor / Pool House |
| capacity | integer | |
| temperature_range | text | e.g. "60–80°C" |
| is_private | boolean | |
| operating_hours | text | |
| pool_type | text | select: Indoor / Outdoor / Indoor-Outdoor / Natural/Dam |
| is_heated | boolean | |
| pool_size | text | e.g. "12m × 5m" |
| pool_depth | text | e.g. "1.2m – 1.8m" |
| lap_swimming | boolean | |
| plunge_type | text | select: Dedicated Cold Plunge / Ice Bath / Cold Shower / Natural Cold Water |
| hot_tub_type | text | select: Hot Tub/Spa / Japanese Ofuro / Outdoor Bath / Magnesium Pool |
| features | text[] | |
| sort_order | integer | |

---

## TAB 6 — RETREAT FACILITIES

> **Retreat Venue ONLY** — not present on Wellness Venue.

### `retreat_facilities` (1-to-1 with retreat_venues)

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| venue_id | uuid | FK → retreat_venues.id |
| facilities_hero_image | text | image url; recommended 1920×600px |
| section_label | text | default: "Retreat Spaces" |
| section_title | text | |
| section_subtitle | text | |
| intro_paragraph | text | |
| supports_yoga_retreats | boolean | |
| supports_meditation_retreats | boolean | |
| supports_nutrition_detox | boolean | |
| supports_womens_retreats | boolean | |
| supports_corporate_wellness | boolean | |
| supports_mindfulness | boolean | |
| supports_sound_healing | boolean | |
| supports_silent_retreats | boolean | |
| supports_breathwork | boolean | |
| supports_plant_medicine | boolean | |
| supports_creative_art | boolean | |
| supports_leadership_coaching | boolean | |
| facility_notes | text | |

### `retreat_spaces` (1-to-many with retreat_venues)

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| venue_id | uuid | FK → retreat_venues.id |
| space_name | text | |
| space_image | text | image url; recommended 800×600px |
| is_featured | boolean | |
| is_available | boolean | |
| space_description | text | |
| space_type | text | select: Dedicated Yoga Studio / Multipurpose Space / Outdoor Platform / Dedicated Meditation Room / Garden Sanctuary / Conference Room / Multipurpose Hall / Boardroom / Sacred Circle / Dedicated Temple / Outdoor Practice Area / Shared Space |
| setting | text | select: Indoor / Outdoor / Indoor/Outdoor |
| view_type | text | select: No Specific View / Ocean / Mountain / Garden / Forest / Lake / Valley / Countryside |
| capacity | integer | |
| size_sqm | numeric | |
| flooring | text | select: Timber / Concrete / Carpet / Sprung Floor / Grass |
| equipment_provided | text[] | |
| sort_order | integer | |

---

## TAB 7 — PRICING & BOOKING

> Same structure for both Retreat and Wellness venues.

### `venue_pricing` (1-to-1)

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| venue_id | uuid | FK |
| venue_type | text | 'retreat' \| 'wellness' |
| pricing_hero_image | text | image url; recommended 1920×600px |
| section_label | text | default: "Booking & Terms" |
| section_title | text | default: "Plan Your Retreat" |
| section_subtitle | text | |
| currency | text | required; select: AUD / USD / EUR / GBP / NZD / JPY |
| pricing_model | text | required; select: Per Night / Per Person Per Night / Per Room Per Night / Flat Rate |
| price_range_category | text | select: Budget / Mid-Range / Upscale / Luxury / Ultra-Luxury |
| base_nightly_rate | numeric | required |
| weekend_rate | numeric | |
| weekly_rate | numeric | |
| cleaning_fee | numeric | |
| group_discounts_available | boolean | |
| group_discount_percentage | numeric | |
| min_nights_for_discount | integer | select: 3 / 5 / 7 / 10 / 14 |
| group_discount_details | text | |
| holiday_surcharge_percentage | numeric | |
| min_stay_default | integer | select: 1–7 nights |
| min_stay_weekends | integer | select: 1–3 nights |
| max_stay | integer | null = no limit |
| advance_booking_required | text | select: None / 24hrs / 48hrs / 7days / 14days / 30days |
| booking_window_opens | text | select: 3–24 months ahead |
| checkin_day_restrictions | text | select: Any day / Fri-Sat only / Weekdays only / Monday only |
| checkin_time | text | |
| checkout_time | text | |
| booking_deposit | text | select: No deposit / 25% / 50% / Full / Fixed amount |
| deposit_due | text | select: At booking / Within 48hrs / Within 7 days |
| balance_due | text | select: At check-in / 7 days / 14 days / 30 days before |
| security_bond | numeric | |
| bond_collection_method | text | select: Pre-authorisation / Held & refunded / Insurance-backed |
| accepted_payment_methods | text[] | |
| cancellation_policy_type | text | select: Flexible / Moderate / Firm / Strict / Super Strict / Custom |
| cancellation_grace_period | text | select: None / 48hrs / 7 days |
| refund_policy_details | text | |

### `venue_seasonal_pricing` (1-to-many)

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| venue_id | uuid | FK |
| venue_type | text | 'retreat' \| 'wellness' |
| season_name | text | |
| date_range | text | e.g. "Dec 20 – Jan 10" |
| season_type | text | select: Peak / High / Standard / Low |
| nightly_rate | numeric | |
| minimum_stay | text | |

---

## TAB 8 — MEDIA

> Same structure for both Retreat and Wellness venues.

### `venue_media` (1-to-1)

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| venue_id | uuid | FK |
| venue_type | text | 'retreat' \| 'wellness' |
| hero_image_url | text | image url |
| hero_image_alt | text | |
| hero_image_caption | text | |
| virtual_tour_url | text | embed url |
| social_share_image | text | image url; recommended 1200×630px |
| twitter_card_image | text | image url; recommended 1200×600px |

### `venue_gallery` (1-to-many)

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| venue_id | uuid | FK |
| venue_type | text | 'retreat' \| 'wellness' |
| image_url | text | image url |
| category | text | select: Exterior / Bedrooms / Living Areas / Kitchen & Dining / Retreat Spaces / Wellness / Grounds |
| sort_order | integer | |

### `venue_videos` (1-to-many)

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| venue_id | uuid | FK |
| venue_type | text | 'retreat' \| 'wellness' |
| video_url | text | YouTube/Vimeo url |
| video_title | text | |
| video_type | text | select: Property Tour / Drone Footage / Promotional / Testimonial / Behind the Scenes |
| is_featured | boolean | |
| video_description | text | |

---

## TAB 9 — INTERNAL

> Same structure for both Retreat and Wellness venues. Admin-only data.

### `venue_internal` (1-to-1)

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| venue_id | uuid | FK |
| venue_type | text | 'retreat' \| 'wellness' |
| identity_verified | boolean | |
| identity_verified_date | date | |
| property_ownership_verified | boolean | |
| insurance_verified | boolean | |
| insurance_details | text | |
| business_registration_verified | boolean | |
| site_visit_completed | boolean | |
| photo_verification_done | boolean | |
| lead_source | text | select: Direct Enquiry / Referral / Outbound / Inbound / Social Media / Industry Event / Partner Network |
| lead_owner | text | |
| acquisition_date | date | |
| pipeline_stage | text | select: New Lead / Contacted / Call Scheduled / Call Completed / Proposal Sent / Signed Up / Onboarding / Live / Churned |
| first_contact_date | date | |
| subscription_tier | text | select: Essentials / Professional / Featured |
| founder_discount | text | select: None / Super Founder / Founder / Early Bird |
| billing_cycle | text | select: Annual upfront / Annual monthly / Monthly |
| subscription_start_date | date | |
| next_billing_date | date | |
| booking_commission_rate | text | select: 3% / 5% / 7% / 10% / Custom |
| experience_commission_rate | text | select: 10% / 15% / 20% / Custom |
| stripe_connect_status | boolean | |
| internal_tags | text[] | |
| priority_flags | text[] | |
| market_segment | text | select: Budget / Mid-range / Premium / Ultra Luxury |
| venue_tier | text | select: Bronze / Silver / Gold / Platinum |

---

## TAB 10 — OWNER/MANAGER

> Same structure for both Retreat and Wellness venues.

### `venue_owner_manager` (1-to-1)

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| venue_id | uuid | FK |
| venue_type | text | 'retreat' \| 'wellness' |
| first_name | text | |
| last_name | text | |
| role | text | select: Owner / Manager / Co-owner / Property Manager / Administrator |
| email | text | |
| phone_primary | text | |
| phone_secondary | text | |
| mailing_address | text | |
| timezone | text | select: Australian timezones |
| preferred_language | text | select: English / Spanish / French / German / Italian / Portuguese / Japanese / Mandarin / Indonesian / Thai |
| business_name | text | |
| abn_tax_id | text | |
| business_type | text | select: Sole Trader / Company / Partnership / Trust |
| registered_business_address | text | |
| gst_registered | boolean | |
| host_display_name | text | |
| host_image_url | text | image url; min 400×400px |
| host_quote | text | |
| host_bio | text | |
| show_host_profile | boolean | |
| preferred_contact_method | text | select: Email / Phone Call / SMS / WhatsApp |
| best_time_to_call | text | select: Morning / Afternoon / Evening / Any time |
| response_time | text | select: Within 1hr / Within 24hrs / Within 48hrs |
| booking_notifications | boolean | |
| marketing_emails | boolean | |
| platform_updates | boolean | |

### `venue_team_members` (1-to-many)

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| venue_id | uuid | FK |
| venue_type | text | 'retreat' \| 'wellness' |
| name | text | |
| role | text | |
| avatar_url | text | image url |
| status | text | |

---

## TAB 11 — BOOKINGS

> Shared table for both venue types.

### `bookings`

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| venue_id | uuid | FK |
| venue_type | text | 'retreat' \| 'wellness' |
| guest_name | text | |
| guest_email | text | |
| guest_phone | text | |
| service_name | text | |
| checkin_date | date | |
| checkout_date | date | |
| guest_count | integer | |
| amount | numeric | |
| status | text | select: pending / confirmed / completed / cancelled |
| notes | text | |
| created_at | timestamptz | |

### `venue_blocked_dates`

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| venue_id | uuid | FK |
| venue_type | text | 'retreat' \| 'wellness' |
| blocked_date | date | |
| block_reason | text | |

---

## TAB 12 — REVIEWS

> Shared table for both venue types.

### `venue_reviews`

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| venue_id | uuid | FK |
| venue_type | text | 'retreat' \| 'wellness' |
| user_name | text | required |
| user_image_url | text | image url |
| rating | integer | 1–5; required |
| review_text | text | required |
| review_date | date | |
| created_at | timestamptz | |

---

## Complete Table Inventory

### Retreat-Specific Tables
| Table | Purpose |
|-------|---------|
| `retreat_venues` | Main overview data |
| `retreat_accommodation` | Sleeping accommodation details |
| `retreat_rooms` | Individual room cards |
| `retreat_facilities` | Retreat-specific spaces & supported types |
| `retreat_spaces` | Individual practice/event space cards |

### Wellness-Specific Tables
| Table | Purpose |
|-------|---------|
| `wellness_venues` | Main overview data |
| `wellness_accommodation` | Service/treatment capacity |

### Shared Tables (venue_id + venue_type)
| Table | Purpose |
|-------|---------|
| `venue_amenities` | All amenity flags & details |
| `venue_wellness_services` | Service checkboxes & settings |
| `venue_practitioners` | Practitioner cards |
| `venue_wellness_facilities` | Wellness facility section header |
| `wellness_facility_items` | Individual facility cards (sauna, pool, etc.) |
| `venue_pricing` | Pricing config & booking rules |
| `venue_seasonal_pricing` | Seasonal rate overrides |
| `venue_media` | Hero, virtual tour, SEO images |
| `venue_gallery` | Photo gallery |
| `venue_videos` | Video entries |
| `venue_internal` | Admin-only pipeline & billing data |
| `venue_owner_manager` | Owner/manager contact & host profile |
| `venue_team_members` | Team member cards |
| `bookings` | Booking records |
| `venue_blocked_dates` | Calendar blocked dates |
| `venue_reviews` | Guest reviews |

**Total: 5 retreat-specific + 2 wellness-specific + 16 shared = 23 tables**
